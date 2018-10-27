import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Rembolso } from '../../models';

import * as moment from 'moment';

@Component({
  selector: 'sx-generar-cheque-rembolso',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>Genera cheque para rembolso: {{rembolso.id}}</h2>
    <mat-dialog-content>
      <div layout="column">

        <mat-form-field >
          <input matInput value="{{rembolso.egreso.cuenta.numero}} ({{rembolso.egreso.cuenta.descripcion}})" disabled="true">
        </mat-form-field>
        <div layout>
          <mat-form-field flex>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha"
              formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput formControlName="cheque" placeholder="Próximo cheque" autocomplete="off">
          </mat-form-field>
        </div>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class GenerarChequeRembolsoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  rembolso: Rembolso;
  subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.rembolso = data.rembolso;
  }

  ngOnInit() {
    this.buildForm();
    this.form.disable();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [{ value: this.pago, disabled: true }],
      cuenta: [this.rembolso.egreso.cuenta],
      cheque: [this.rembolso.egreso.cuenta.proximoCheque]
    });
  }

  get pago() {
    return moment(this.rembolso.fechaDePago).toDate();
  }
}
