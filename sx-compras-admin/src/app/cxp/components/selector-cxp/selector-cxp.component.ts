import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sx-selector-cxp',
  template: `
    <button mat-button [disabled]="disabled">{{label}}</button>
  `
})
export class SelectorCxPComponent implements OnInit {
  @Input() label = 'Seleccionar CxP';
  @Input() disabled = false;
  constructor() {}

  ngOnInit() {}
}
