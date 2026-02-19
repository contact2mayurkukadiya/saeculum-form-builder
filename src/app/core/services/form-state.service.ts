import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { IForm } from '../models/form.interface';
import { IElement } from '../models/element.interface';
import { FormElementType, QuestionType } from '../enums/question-type';
import { StorageService } from './storage.service';
import { UndoRedoService } from './undo-redo.service';

const INITIAL_FORM: IForm = {
  id: uuidv4(),
  pages: []
};

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private _form = new BehaviorSubject<IForm>(INITIAL_FORM);
  public form$ = this._form.asObservable();

  // Holds ALL IDs (Page IDs + Section IDs) to allow dropping anywhere
  private _dropListIds = new BehaviorSubject<string[]>([]);
  public dropListIds$ = this._dropListIds.asObservable();

  // Add Subject to track focus requests
  private _focusedElementId = new BehaviorSubject<string | null>(null);
  public focusedElementId$ = this._focusedElementId.asObservable();

  constructor(
    private storage: StorageService,
    private undoRedo: UndoRedoService<IForm>
  ) {
    this.refreshDropListIds(INITIAL_FORM); // Init IDs

    this.form$.pipe(
      debounceTime(500), // Faster debounce for smoother feel
      distinctUntilChanged()
    ).subscribe(form => {
      this.storage.saveForm(form);
      this.refreshDropListIds(form);
    });
  }

  get currentForm(): IForm {
    return this._form.getValue();
  }

  private updateState(newForm: IForm, recordHistory: boolean = true): void {
    if (recordHistory) {
      this.undoRedo.record(this.currentForm);
    }
    this._form.next(newForm);
  }

  // --- Actions ---

  addPage(): void {
    const newForm = structuredClone(this.currentForm);
    newForm.pages.push({
      id: uuidv4(),
      title: `Page ${newForm.pages.length + 1}`,
      elements: []
    });
    this.updateState(newForm);
  }

  deletePage(pageId: string): void {
    const newForm = structuredClone(this.currentForm);
    newForm.pages = newForm.pages.filter(p => p.id !== pageId);
    this.updateState(newForm);
  }

  updatePageTitle(pageId: string, title: string): void {
    const newForm = structuredClone(this.currentForm);
    const page = newForm.pages.find(p => p.id === pageId);
    if (page) {
      page.title = title;
      this.updateState(newForm);
    }
  }

  addElement(
    parentId: string | null,
    type: FormElementType,
    questionType: QuestionType = QuestionType.SHORT_TEXT,
    pageId: string
  ): void {
    const newForm = structuredClone(this.currentForm);
    const newElement: IElement = {
      id: uuidv4(),
      type,
      label: type === FormElementType.SECTION ? 'New Section' : '',
      questionType: type === FormElementType.QUESTION ? questionType : undefined,
      children: type === FormElementType.SECTION ? [] : undefined,
      isExpanded: true,
      parentId: parentId
    };

    const page = newForm.pages.find(p => p.id === pageId);
    if (!page) return;

    if (!parentId) {
      page.elements.push(newElement);
    } else {
      this.recursiveAddElement(page.elements, parentId, newElement);
    }

    this.updateState(newForm);
    this._focusedElementId.next(newElement.id);
  }

  updateElementLabel(elementId: string, newLabel: string): void {
    const newForm = structuredClone(this.currentForm);
    let found = false;
    for (const page of newForm.pages) {
      if (this.recursiveUpdateLabel(page.elements, elementId, newLabel)) {
        found = true;
        break;
      }
    }
    if (found) this.updateState(newForm);
  }

  updateElementType(elementId: string, newType: QuestionType): void {
    const newForm = structuredClone(this.currentForm);
    let found = false;

    // Helper to find and update
    const recursiveUpdate = (elements: IElement[]): boolean => {
      for (const el of elements) {
        if (el.id === elementId) {
          el.questionType = newType;
          // Reset values in state as well
          el.value = newType === QuestionType.CHECKBOX ? false : '';
          return true;
        }
        if (el.children && recursiveUpdate(el.children)) return true;
      }
      return false;
    };

    for (const page of newForm.pages) {
      if (recursiveUpdate(page.elements)) {
        found = true;
        break;
      }
    }

    if (found) this.updateState(newForm);
  }

  clearFocus(): void {
    this._focusedElementId.next(null);
  }


  toggleSection(sectionId: string): void {
    const newForm = structuredClone(this.currentForm);
    for (const page of newForm.pages) {
      this.recursiveToggle(page.elements, sectionId);
    }
    this.updateState(newForm, false);
  }

  deleteElement(elementId: string): void {
    const newForm = structuredClone(this.currentForm);
    for (const page of newForm.pages) {
      page.elements = this.recursiveDelete(page.elements, elementId);
    }
    this.updateState(newForm);
  }

  // --- Drag & Drop Logic (Cross Page & Nested) ---

  moveItem(
    prevContainerId: string,
    currContainerId: string,
    prevIndex: number,
    currIndex: number
  ): void {
    const newForm = structuredClone(this.currentForm);

    // 1. Find Source
    // Source could be a Page (ID: page-UUID) or a Section (ID: UUID)
    const { container: sourceContainer, elements: sourceList } = this.findContainerAndList(newForm, prevContainerId);
    if (!sourceList) return;

    const itemToMove = sourceList[prevIndex];

    // 2. Find Target
    const { container: targetContainer, elements: targetList } = this.findContainerAndList(newForm, currContainerId);
    if (!targetList) return;

    // 3. Execute Move
    sourceList.splice(prevIndex, 1);

    // Update metadata
    if (currContainerId.startsWith('page-')) {
      itemToMove.parentId = null;
    } else {
      itemToMove.parentId = currContainerId;
    }

    targetList.splice(currIndex, 0, itemToMove);

    this.updateState(newForm);
  }

  // Helper to find list by ID (Page ID or Section ID)
  private findContainerAndList(form: IForm, containerId: string): { container: any, elements: IElement[] | undefined } {
    // Check Pages
    if (containerId.startsWith('page-')) {
      const pId = containerId.replace('page-', '');
      const page = form.pages.find(p => p.id === pId);
      return { container: page, elements: page?.elements };
    }

    // Check Sections (Deep Search)
    for (const page of form.pages) {
      const list = this.findElementChildren(page.elements, containerId);
      if (list) return { container: null, elements: list }; // We just need the list reference
    }

    return { container: null, elements: undefined };
  }

  // --- Undo / Redo ---
  triggerUndo(): void {
    const prev = this.undoRedo.undo(this.currentForm);
    if (prev) this._form.next(prev);
  }

  triggerRedo(): void {
    const next = this.undoRedo.redo(this.currentForm);
    if (next) this._form.next(next);
  }

  // --- Recursion Helpers ---
  private recursiveAddElement(elements: IElement[], parentId: string, newElement: IElement): boolean {
    for (const el of elements) {
      if (el.id === parentId && el.children) {
        el.children.push(newElement);
        el.isExpanded = true;
        return true;
      }
      if (el.children && this.recursiveAddElement(el.children, parentId, newElement)) return true;
    }
    return false;
  }

  private recursiveUpdateLabel(elements: IElement[], id: string, label: string): boolean {
    for (const el of elements) {
      if (el.id === id) { el.label = label; return true; }
      if (el.children && this.recursiveUpdateLabel(el.children, id, label)) return true;
    }
    return false;
  }

  private recursiveToggle(elements: IElement[], id: string): void {
    for (const el of elements) {
      if (el.id === id) { el.isExpanded = !el.isExpanded; return; }
      if (el.children) this.recursiveToggle(el.children, id);
    }
  }

  private recursiveDelete(elements: IElement[], id: string): IElement[] {
    return elements.filter(el => {
      if (el.id === id) return false;
      if (el.children) el.children = this.recursiveDelete(el.children, id);
      return true;
    });
  }

  private findElementChildren(elements: IElement[], containerId: string): IElement[] | undefined {
    for (const el of elements) {
      if (el.id === containerId) return el.children;
      if (el.children) {
        const found = this.findElementChildren(el.children, containerId);
        if (found) return found;
      }
    }
    return undefined;
  }

  private refreshDropListIds(form: IForm): void {
    const ids: string[] = [];
    form.pages.forEach(p => {
      ids.push(`page-${p.id}`); // Page Container ID
      this.collectSectionIds(p.elements, ids);
    });
    this._dropListIds.next(ids);
  }

  private collectSectionIds(elements: IElement[], ids: string[]): void {
    elements.forEach(el => {
      if (el.type === FormElementType.SECTION) {
        ids.push(el.id); // Section Container ID
        if (el.children) this.collectSectionIds(el.children, ids);
      }
    });
  }
}