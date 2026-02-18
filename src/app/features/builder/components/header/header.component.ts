import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStateService } from '../../../../core/services/form-state.service';
import { UndoRedoService } from '../../../../core/services/undo-redo.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsModule } from '../../../../shared/icon.module';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzButtonModule, IconsModule],
  template: `
    <header class="h-16 bg-black border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-6 shadow-sm">
      <div class="flex items-center gap-2 p-1">
        <button [disabled]="!undoService.canUndo()"  (click)="formState.triggerUndo()" nz-button nzType="default" class="flex items-center"><span antIcon type="undo" theme="outline"></span></button>
        <button [disabled]="!undoService.canRedo()" (click)="formState.triggerRedo()" nz-button nzType="default" class="flex items-center"><span antIcon type="redo" theme="outline"></span></button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  formState = inject(FormStateService);
  undoService = inject(UndoRedoService);
}