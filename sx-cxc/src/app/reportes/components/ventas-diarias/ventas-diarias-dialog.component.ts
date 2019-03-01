import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import * as moment from 'moment';

@Component({
  selector: 'sx-ventas-diarias-dialog',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 mat-dialog-title>
        Reporte de ventas diarias
      </h4>
      <div layout="column" class="selector-form">

        <mat-form-field flex>
          <input matInput [matDatepicker]="picker" placeholder="Fecha" formControlName="fecha">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <sx-sucursal-field [parent]="form"></sx-sucursal-field>
        <mat-form-field>
          <mat-select placeholder="Tipo" formControlName="origen">
            <mat-option *ngFor="let tipo of ['CRE','CON','COD', 'TODAS']" [value]="tipo">
              {{tipo}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-dialog-actions>
        <button mat-button class="accent" type="submit" [disabled]="form.invalid">Aceptar</button>
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </mat-dialog-actions>

    </form>

  `
})
export class VentasDiariasDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VentasDiariasDialogComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      sucursal: [null, Validators.required],
      origen: ['CRE', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fecha: Date = this.form.get('fecha').value;
    const sucursal = this.form.get('sucursal').value;
    const res = {
      fecha: moment(fecha).format('DD/MM/YYYY'),
      sucursal: sucursal.id,
      origen: this.form.get('origen').value
    };
    if (res.origen === 'TODAS') {
      res.origen = '%';
    }
    this.dialogRef.close(res);
  }
}
