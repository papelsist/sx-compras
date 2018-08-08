import { Component, OnInit, Input } from '@angular/core';

import { Proveedor } from 'app/proveedores/models/proveedor';

@Component({
  selector: 'sx-selector-cxp',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="select()">{{label}}</button>
  `
})
export class SelectorCxPComponent implements OnInit {
  @Input() label = 'Seleccionar CxP';
  @Input() disabled = false;
  @Input() proveedor: Proveedor;
  constructor() {}

  ngOnInit() {}

  select() {
    console.log('Buscando facturas de: ', this.proveedor);
  }
}
