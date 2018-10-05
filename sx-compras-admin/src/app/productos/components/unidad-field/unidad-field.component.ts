import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-unidad-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Unidad" [formControlName]="entityField" >
        <mat-option *ngFor="let unidad of unidades" [value]="unidad.clave">
          {{unidad.descripcion}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una unidad</mat-error>
    </mat-form-field>
  `
})
export class UnidadFieldComponent implements OnInit {
  @Input()
  unidades: any[] = [
    { clave: 'MIL', descripcion: 'MILLAR' },
    { clave: 'PZA', descripcion: 'PIEZA' },
    { clave: 'KGS', descripcion: 'KILO' },
    { clave: 'BOL', descripcion: 'BOLSA' },
    { clave: 'TM.', descripcion: 'TONELADA' },
    { clave: 'MTS', descripcion: 'METROS' }
  ];
  @Input()
  parent: FormGroup;
  @Input()
  entityField = 'unidad';

  constructor() {}

  ngOnInit() {}
}
