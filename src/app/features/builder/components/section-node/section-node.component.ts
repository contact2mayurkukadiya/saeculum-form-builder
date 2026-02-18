import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { IElement } from '../../../../core/models/section.interface';
import { FormElementType, QuestionType } from '../../../../core/enums/question-type';
import { QuestionNodeComponent } from '../question-node/question-node.component';
import { FormStateService } from '../../../../core/services/form-state.service';
import { AsyncPipe } from '@angular/common';
import { IconsModule } from '../../../../shared/icon.module';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-section-node',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    QuestionNodeComponent,
    AsyncPipe,
    IconsModule,
    NzTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-node.component.html'
})
export class SectionNodeComponent {
  @Input({ required: true }) element!: IElement;
  @Input({ required: true }) pageId!: string;

  @Output() update = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  ElementType = FormElementType;
  formState = inject(FormStateService);
  dropListIds$ = this.formState.dropListIds$;

  drop(event: CdkDragDrop<IElement[] | undefined>) {
    this.formState.moveItem(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex
    );
  }

  onLabelChange(newVal: string) { this.update.emit(newVal); }
  updateLabel(id: string, label: string) { this.formState.updateElementLabel(id, label); }
  deleteItem(id: string) { this.formState.deleteElement(id); }
  toggleItem(id: string) { this.formState.toggleSection(id); }

  onAddQuestion() {
    this.formState.addElement(this.element.id, FormElementType.QUESTION, QuestionType.SHORT_TEXT, this.pageId);
  }

  onAddSection() {
    this.formState.addElement(this.element.id, FormElementType.SECTION, QuestionType.SHORT_TEXT, this.pageId);
  }

  addQuestionAfter() { this.onAddQuestion(); }
}