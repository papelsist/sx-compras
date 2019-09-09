import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef
} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'sx-numeric-cell-editor',
  template: `<input #input (keypress)="onKeyPress($event)" (keydown)="onKeyDown($event)" [(ngModel)]="value" [selectionStart]="0">`,
  styles: [
    `
      input {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class NumericCellEditorComponent
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: number;
  private cancelBeforeStart = false;

  @ViewChild('input')
  public input: ElementRef;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;

    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      params.charPress && '1234567890.'.indexOf(params.charPress) < 0;
  }

  getValue(): any {
    return this.value;
  }

  onClick(event) {
    event.stopPropagation();
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  // will reject the number if it greater than 1,000,000
  // not very practical, but demonstrates the method.
  isCancelAfterEnd(): boolean {
    return false;
  }

  onKeyPress(event): void {
    /*
    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
    */
    if (!this.isCharNumeric(event.key)) {
      event.preventDefault();
    }
  }
  onKeyDown(event) {
    if (event.keyCode === 39 || event.keyCode === 37 || event.keyCode === 9) {
      event.stopPropagation();
    }
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.input.nativeElement.focus();
    });
  }

  private getCharCodeFromEvent(event): any {
    event = event || window.event;
    return typeof event.which === 'undefined' ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr): boolean {
    // return !!/\d/.test(charStr);
    return !!/^-?\d+\.?\d*$/.test(charStr);
  }

  private isKeyPressedNumeric(event): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }
}
