import { Component, OnInit, Input } from '@angular/core';
import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-agregar-prov-producto',
  template: `
  <a mat-fab (click)="onAgregar()"
      matTooltip="Agregar producto"
      matTooltipPosition="before" color="accent"
      class="mat-fab-position-bottom-right ">
    <mat-icon>add</mat-icon>
  </a>
  `
})
export class AgregarProvProductoComponent implements OnInit {
  @Input() proveedor: Proveedor;
  constructor() {}

  ngOnInit() {}

  onAgregar() {}
}
