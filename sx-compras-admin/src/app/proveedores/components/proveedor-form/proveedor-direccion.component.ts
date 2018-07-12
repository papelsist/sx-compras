import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-proveedor-direccion',
  template: `
  <mat-expansion-panel [formGroup]="parent">
    <mat-expansion-panel-header>
      <mat-panel-title>
        <sx-direccion-form [parent]="parent"></sx-direccion-form>
      </mat-panel-title>
    </mat-expansion-panel-header>
  </mat-expansion-panel>
  `
})
export class ProveedorDireccionComponent implements OnInit {
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}
}
