import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-rep-comision-tarjetas',
  template: `
  <form novalidate [formGroup]="form">
    <h2 mat-dialog-title>Comisiones de tarjetas</h2>

    <mat-dialog-content layout="column">
      <mat-form-field>
        <input matInput [matDatepicker]="myDatepicker" formControlName="fecha">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-select placeholder="Sucursal" formControlName="sucursal">
          <mat-option *ngFor="let sucursal of sucursales" [value]="sucursal.id">
            {{sucursal.nombre}}
          </mat-option>
        </mat-select>
      </mat-form-field>
  </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">Ejecutar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class RepComisionTarjetasComponent implements OnInit {
  form: FormGroup;
  sucursales: any[];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sucursales = data.sucursales;
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      sucursal: [null, Validators.required]
    });
  }

  ngOnInit() {}
}
