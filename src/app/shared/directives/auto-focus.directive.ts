import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    // Small timeout to ensure DOM is ready
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 100);
  }
}