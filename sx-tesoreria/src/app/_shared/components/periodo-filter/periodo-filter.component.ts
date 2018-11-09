import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

@Component({
  selector: 'sx-periodo-filter',
  template: `
  <h2 mat-dialog-title>{{title}}</h2>
  <mat-dialog-content>
  <form [formGroup]="form">
    <mat-form-field >
      <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha inicial" formControlName="fechaInicial">
      <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
      <mat-datepicker #myDatepicker></mat-datepicker>
    </mat-form-field>
    <mat-form-field >
      <input matInput [matDatepicker]="myDatepicker2" placeholder="Fecha final" formControlName="fechaFinal">
      <mat-datepicker-toggle matSuffix [for]="myDatepicker2"></mat-datepicker-toggle>
      <mat-datepicker #myDatepicker2></mat-datepicker>
    </mat-form-field>
    <div layout="column">
      <h3>Registros {{form.value.registros}}</h3>
      <mat-slider thumbLabel step="10" tickInterval="10" min="10" max="500" formControlName="registros" flex></mat-slider>
    </div>
  </form>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Canelar</button>
    <button mat-button [mat-dialog-close]="getPeriodo()" [disabled]="form.invalid">Aceptar</button>
  </mat-dialog-actions>
`
})
export class PeriodoFilterComponent implements OnInit {
  filter: PeriodoFilter;
  form: FormGroup;
  title;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Seleccione un periodo';
    this.filter = data.filter || createPeriodoFilter(30);
    this.buildForm();
    this.form.setValue(this.filter);
  }

  buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
      registros: [30]
    });
  }

  getPeriodo() {
    if (this.form.valid) {
      return this.form.value;
    }
    return null;
  }

  ngOnInit() {}
}
