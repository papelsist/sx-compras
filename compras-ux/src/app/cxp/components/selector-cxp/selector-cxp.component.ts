import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';

import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagarService } from '../../services';

@Component({
  selector: 'sx-selector-cxp',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="select()">{{label}}</button>
  `
})
export class SelectorCxPComponent implements OnInit {
  @Input() label = 'Seleccionar facturas';
  @Input() disabled = false;
  @Input() proveedor: Proveedor;

  constructor(
    private service: CuentaPorPagarService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  select() {
    console.log('Buscando facturas de: ', this.proveedor);
  }
}
