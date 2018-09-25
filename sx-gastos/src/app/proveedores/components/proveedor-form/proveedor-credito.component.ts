import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-proveedor-credito',
  template: `
  <mat-expansion-panel [formGroup]="parent">
    <mat-expansion-panel-header>
      <mat-panel-title>
        Línea de crédito
      </mat-panel-title>
      <mat-panel-description>
        <span class="tc-blue-600">
          {{parent.get('limiteDeCredito').value | currency}}
        </span>
      </mat-panel-description>
    </mat-expansion-panel-header>
    <div layout>
      <mat-form-field flex>
        <input matInput placeholder="Límite "
          formControlName="limiteDeCredito" type="number">
      </mat-form-field>
      <mat-form-field class="pad-left" >
        <input matInput placeholder="Plazo" formControlName="plazo" type="number">
      </mat-form-field>
    </div>
    <div layout>
      <mat-form-field flex>
        <input matInput placeholder="Dscto financiero "
          formControlName="descuentoF" type="number">
      </mat-form-field>
      <mat-form-field class="pad-left" >
        <input matInput placeholder="Plazo (D.F)"
          formControlName="diasDF" type="number">
      </mat-form-field>
    </div>
    <div layout>
      <mat-checkbox formControlName="fechaRevision" flex>Fecha revisión</mat-checkbox>
      <mat-checkbox formControlName="imprimirCosto" flex>Imprimir Costo</mat-checkbox>
    </div>
  </mat-expansion-panel>
  `
})
export class ProveedorCreditoComponent implements OnInit {
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}
}
