import { Directive, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) { }

  @Output('clickOutside') clickOutside: EventEmitter<void> = new EventEmitter();
  @Input() elementsIgnore: HTMLElement[];
  @HostListener('document:click', ['$event.target']) clickedElementOutSide(targetElement: HTMLElement) {
    if (!this._elementRef && !(this._elementRef as ElementRef).nativeElement && !targetElement) {
      return;
    }
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    const clickedIgnoreElements = this.elementsIgnore && this.elementsIgnore.includes(targetElement);
    const clickedChildIgnoreElements = this.elementsIgnore && this.elementsIgnore.some(el => {
      return el.contains(targetElement);
    });
    if (!clickedInside && !clickedIgnoreElements && !clickedChildIgnoreElements) {
      this.clickOutside.emit();
    }
  }
  @HostListener('document:keydown', ['$event']) keyboardClick(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.clickOutside.emit();
    }
  }

}
