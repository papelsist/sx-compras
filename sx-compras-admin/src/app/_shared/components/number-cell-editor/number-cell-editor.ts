import { Component, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'sx-numeric-cell-editor',
  template: `
    <input
      #i
      (keypress)="onKeyPress($event)"
      (keydown)="onKeyDown($event)"
      class="fx"
    />
  `,
  styles: [
    `
      .fx {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;
        border: none #ffffff;
        color: blue;
      }
    `
  ]
})
export class NumericCellEditorComponent implements AfterViewInit {
  @ViewChild('i') textInput;
  params;

  ngAfterViewInit() {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    this.params = params;
  }

  getValue() {
    return this.textInput.nativeElement.value;
  }

  onKeyPress(event) {
    if (!isNumeric(event)) {
      event.preventDefault();
    }

    function isNumeric(ev) {
      return /\d/.test(ev.key);
    }
  }

  onKeyDown(event) {
    if (event.keyCode === 39 || event.keyCode === 37) {
      event.stopPropagation();
    }
  }
}
