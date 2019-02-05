import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CfdisFilter } from '../../models';

@Component({
  selector: 'sx-cfdis-filter',
  template: `
    <form [formGroup]="form">
      <h2 mat-dialog-title>{{ title }}</h2>
      <mat-dialog-content>
        <div layout>
          <mat-form-field flex>
            <input
              matInput
              [matDatepicker]="myDatepicker"
              placeholder="Fecha inicial"
              formControlName="fechaInicial"
              autocomplete="off"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="myDatepicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field flex class="pad-left pad-right">
            <input
              matInput
              [matDatepicker]="myDatepicker2"
              placeholder="Fecha final"
              formControlName="fechaFinal"
              autocomplete="off"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="myDatepicker2"
            ></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker2></mat-datepicker>
          </mat-form-field>
        </div>
        <div layout>
          <mat-form-field flex>
            <input
              matInput
              placeholder="Receptor"
              autocomplete="off"
              formControlName="receptor"
            />
          </mat-form-field>
        </div>

        <div layout="column">
          <h3>Registros {{ form.value.registros }}</h3>
          <mat-slider
            thumbLabel
            step="10"
            tickInterval="10"
            min="10"
            max="200"
            formControlName="registros"
            flex
          ></mat-slider>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button
          mat-button
          [mat-dialog-close]="form.value"
          [disabled]="form.invalid"
        >
          Aceptar
        </button>
        <button mat-button mat-dialog-close>Canelar</button>
      </mat-dialog-actions>
    </form>
  `
})
export class CfdisFilterComponent implements OnInit {
  title;
  form: FormGroup;
  filter: CfdisFilter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Filtro de Cfdis';
    this.filter = data.filter;
  }

  ngOnInit() {
    this.buildForm();
    if (this.filter) {
      this.form.patchValue(this.filter);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null],
      fechaFinal: [null],
      receptor: [null],
      registros: [100, [Validators.required, Validators.max(1000)]]
    });
  }
}
