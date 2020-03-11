import { Component } from '@angular/core';

@Component({
  selector: 'sx-number-formatter-cell',
  template: `
    <span>{{ params.value | currency }}</span>
  `
})
export class NumberFormatterComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }
}
