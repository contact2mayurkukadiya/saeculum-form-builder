import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IElement } from '../../../../core/models/section.interface';
import { QuestionType } from '../../../../core/enums/question-type';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { IconsModule } from '../../../../shared/icon.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-question-node',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonComponent,
    IconsModule,
    NzSelectModule,
    NzTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './question-node.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class QuestionNodeComponent {
  @Input({ required: true }) element!: IElement;
  @Output() labelChange = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() addNext = new EventEmitter<void>();
  @Output() typeChange = new EventEmitter<QuestionType>();

  QuestionType = QuestionType;

  handleEnter(event: Event) {
    (event.target as HTMLElement).blur();
    this.addNext.emit();
  }

  onTypeChange(newType: QuestionType) {
    // A. Reset the value to prevent type mismatches (e.g., boolean vs string)
    if (newType === QuestionType.CHECKBOX) {
      this.element.value = false;
      // If you had an options array in IElement, initialize it here:
      // this.element.options = [{ label: 'Option 1', value: 'opt1' }];
    } else {
      this.element.value = '';
    }

    // B. Emit to parent so FormStateService can save to IDB and Undo/Redo stack
    this.typeChange.emit(newType);
  }

}