import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { FormStateService } from '../../core/services/form-state.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IconsModule } from '../../shared/icon.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormElementType, QuestionType } from '../../core/enums/question-type';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, HeaderComponent, PageContainerComponent, AsyncPipe, DatePipe, IconsModule, NzButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './builder.component.html'
})
export class BuilderComponent {
  formState = inject(FormStateService);
  form$ = this.formState.form$;

  addQuestion() {
    const pageId = this.formState.currentForm.pages[this.formState.currentForm.pages.length - 1]?.id;
    if (pageId) {
      this.formState.addElement(null, FormElementType.QUESTION, QuestionType.SHORT_TEXT, pageId);
    } else {
      this.formState.addPage();
      setTimeout(() => {
        const newPageId = this.formState.currentForm.pages[this.formState.currentForm.pages.length - 1]?.id;
        if (newPageId) {
          this.formState.addElement(null, FormElementType.QUESTION, QuestionType.SHORT_TEXT, newPageId);
        }
      });
    }
  }

  addSection() {
    const pageId = this.formState.currentForm.pages[this.formState.currentForm.pages.length - 1]?.id;
    if (pageId) {
      this.formState.addElement(null, FormElementType.SECTION, QuestionType.SHORT_TEXT, pageId);
    } else {
      this.formState.addPage();
      setTimeout(() => {
        const newPageId = this.formState.currentForm.pages[this.formState.currentForm.pages.length - 1]?.id;
        if (newPageId) {
          this.formState.addElement(null, FormElementType.SECTION, QuestionType.SHORT_TEXT, newPageId);
        }
      });
    }
  }
}