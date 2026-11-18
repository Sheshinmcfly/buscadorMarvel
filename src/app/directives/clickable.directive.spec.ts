import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClickableDirective } from './clickable.directive';

@Component({
  imports: [ClickableDirective],
  template: `<div appClickable (click)="clicks = clicks + 1"><span class="inner">texto</span></div>`,
})
class HostComponent {
  clicks = 0;
}

describe('ClickableDirective', () => {
  function render() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[appClickable]') as HTMLElement;
    return { host: fixture.componentInstance, el };
  }

  it('agrega rol de botón y foco por teclado', () => {
    const { el } = render();
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('activa con Enter y con Espacio', () => {
    const { host, el } = render();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(host.clicks).toBe(2);
  });

  it('ignora teclas que vienen de elementos internos', () => {
    const { host, el } = render();
    el.querySelector('.inner')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(host.clicks).toBe(0);
  });
});
