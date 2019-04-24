import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'sx-analisis-de-embarque-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h2 mat-dialog-title>Análisis de embarque</h2>
  <mat-dialog-content>
  <div [formGroup]="form">
    <div layout layout-align="center">
      <mat-form-field class="pad-right" >
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha inicial" formControlName="fechaInicial">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <span flex></span>
      <mat-form-field >
        <input matInput [matDatepicker]="myDatepicker2" placeholder="Fecha final" formControlName="fechaFinal">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker2"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker2></mat-datepicker>
      </mat-form-field>
    </div>
    <div layout>

    <mat-form-field flex class="pad-right">
        <mat-select placeholder="Orden" formControlName="orden">
          <mat-option *ngFor="let item of ORDEN" [value]="item.clave">
            {{ item.descripcion }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field flex>
        <mat-select placeholder="Forma" formControlName="forma">
          <mat-option value="ASC">ASCENDENTE</mat-option>
          <mat-option value="DESC">DESCENDENTE</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div layout>
      <sx-sucursal-field [parent]="form" ></sx-sucursal-field>
    </div>


  </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close type="button">CANCELAR</button>
    <button mat-button (click)="onSubmit()" [disabled]="form.invalid" type="button">ACEPTAR</button>
  </mat-dialog-actions>
  `
})
export class AnalisisDeEmbarquesDialogComponent implements OnInit {
  form: FormGroup;
  ORDEN = [
    { clave: '16', descripcion: 'TONELADAS' },
    { clave: '17', descripcion: 'OPERACIONES' },
    { clave: '18', descripcion: 'COMISIONES' },
    { clave: '1', descripcion: 'CHOFER' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AnalisisDeEmbarquesDialogComponent>,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      fechaInicial: [new Date(), [Validators.required]],
      fechaFinal: [new Date(), [Validators.required]],
      orden: [this.ORDEN[0].clave, [Validators.required]],
      forma: ['asc', [Validators.required]],
      sucursal: [null]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const { sucursal } = this.form.value;
      const data = {
        ...this.form.value,
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        sucursal: sucursal ? sucursal.id : null
      };
      this.dialogRef.close(data);
    }
  }
}
