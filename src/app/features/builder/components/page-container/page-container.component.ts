import { Component, Input, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { IPage } from '../../../../core/models/page.interface';
import { SectionNodeComponent } from '../section-node/section-node.component';
import { QuestionNodeComponent } from '../question-node/question-node.component';
import { FormStateService } from '../../../../core/services/form-state.service';
import { FormElementType, QuestionType } from '../../../../core/enums/question-type';
import { IconsModule } from '../../../../shared/icon.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus.directive';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    SectionNodeComponent,
    QuestionNodeComponent,
    FormsModule,
    IconsModule,
    NzButtonModule,
    AutoFocusDirective,
    NzPopoverModule,
    NzDividerModule,
    NzTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-container.component.html'
})
export class PageContainerComponent {
  @Input({ required: true }) page!: IPage;

  formState = inject(FormStateService);
  dropListIds$ = this.formState.dropListIds$;
  ElementType = FormElementType;
  QuestionType = QuestionType;

  isExpanded = signal(true);

  isEditingTitle = false;
  tempTitle = '';

  togglePage() {
    this.isExpanded.update(v => !v);
  }

  drop(event: CdkDragDrop<any>) {
    this.formState.moveItem(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex
    );
  }

  enableEdit(event: Event) {
    event.stopPropagation();
    this.tempTitle = this.page.title;
    this.isEditingTitle = true;
  }

  saveTitle(event: Event) {
    event.stopPropagation();
    if (this.tempTitle.trim()) {
      this.formState.updatePageTitle(this.page.id, this.tempTitle);
    }
    this.isEditingTitle = false;
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.isEditingTitle = false;
    this.tempTitle = '';
  }


  updateLabel(id: string, label: string) { this.formState.updateElementLabel(id, label); }
  deleteItem(id: string) { this.formState.deleteElement(id); }
  updateType(id: string, type: QuestionType) { this.formState.updateElementType(id, type); }
  toggleItem(id: string) { this.formState.toggleSection(id); }

  addQuestionRoot() {
    this.formState.addElement(null, FormElementType.QUESTION, QuestionType.SHORT_TEXT, this.page.id);
  }

  addSectionRoot() {
    this.formState.addElement(null, FormElementType.SECTION, QuestionType.SHORT_TEXT, this.page.id);
  }

  deletePage() {
    this.formState.deletePage(this.page.id);
  }
}