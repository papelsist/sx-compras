import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sx-selector-cxc',
  template: `
    <button mat-button (click)="seleccionar()" color="primary">
      <mat-icon>add</mat-icon> FACTURAS
    </button>
  `
})
export class SelectorDeCuentasPorCobrarComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  seleccionar() {}
}
