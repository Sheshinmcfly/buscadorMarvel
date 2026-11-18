import { Directive, ElementRef, inject } from '@angular/core';

// Hace accesible por teclado un elemento no nativo que reacciona a (click): foco con Tab y activación con Enter o Espacio.
@Directive({
  selector: '[appClickable]',
  host: {
    role: 'button',
    tabindex: '0',
    '(keydown.enter)': 'activate($event)',
    '(keydown.space)': 'activate($event)',
  },
})
export class ClickableDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  protected activate(event: Event): void {
    if (event.target !== this.el.nativeElement) return;
    event.preventDefault();
    this.el.nativeElement.click();
  }
}
