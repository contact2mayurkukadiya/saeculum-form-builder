import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStateService } from '../../../../core/services/form-state.service';
import { UndoRedoService } from '../../../../core/services/undo-redo.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsModule } from '../../../../shared/icon.module';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzButtonModule, IconsModule, NzTooltipModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  formState = inject(FormStateService);
  undoService = inject(UndoRedoService);

  handleClick() {
    console.log(this.formState.currentForm);
  }
}