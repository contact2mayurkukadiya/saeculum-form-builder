import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private history: T[] = [];
  private future: T[] = [];

  // Signals to update UI state (enable/disable buttons)
  public canUndo: WritableSignal<boolean> = signal(false);
  public canRedo: WritableSignal<boolean> = signal(false);

  /**
   * Pushes a new state to history.
   * Clears future stack because a new path is taken.
   */
  record(state: T): void {
    // Deep copy to prevent reference mutation issues
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.future = [];
    this.updateSignals();
  }

  undo(currentState: T): T | null {
    if (this.history.length === 0) return null;

    const previousState = this.history.pop();
    if (previousState) {
      this.future.push(JSON.parse(JSON.stringify(currentState)));
      this.updateSignals();
      return previousState;
    }
    return null;
  }

  redo(currentState: T): T | null {
    if (this.future.length === 0) return null;

    const nextState = this.future.pop();
    if (nextState) {
      this.history.push(JSON.parse(JSON.stringify(currentState)));
      this.updateSignals();
      return nextState;
    }
    return null;
  }

  private updateSignals(): void {
    this.canUndo.set(this.history.length > 0);
    this.canRedo.set(this.future.length > 0);
  }
}