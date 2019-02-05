import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Requisicion } from '../../models';

import * as moment from 'moment';

@Component({
  selector: 'sx-generar-cheque',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>Genera cheque para requisición: {{requisicion.folio}}</h2>
    <mat-dialog-content>
      <div layout="column">

        <mat-form-field >
          <input matInput value="{{requisicion.egreso.cuenta.numero}} ({{requisicion.egreso.cuenta.descripcion}})" disabled="true">
        </mat-form-field>
        <div layout>
          <mat-form-field flex>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha"
              formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput formControlName="referencia" placeholder="Próximo cheque" autocomplete="off">
          </mat-form-field>
        </div>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class GenerarChequeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  requisicion: Requisicion;
  subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.requisicion = data.requisicion;
  }

  ngOnInit() {
    this.buildForm();
    // this.form.disable();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [{ value: this.pago, disabled: true }],
      cuenta: [{ value: this.requisicion.egreso.cuenta, disabled: true }],
      referencia: [
        this.requisicion.egreso.cuenta.proximoCheque,
        Validators.required
      ]
    });
  }

  get pago() {
    return moment(this.requisicion.fechaDePago).toDate();
  }
}
