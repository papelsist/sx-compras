import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PagoDeNomina } from '../../models';

import * as moment from 'moment';

@Component({
  selector: 'sx-generar-cheque-nomina',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>Genera cheque para pago nomina: {{pago.id}}</h2>
    <mat-dialog-content>
      <div layout="column">

        <mat-form-field >
          <input matInput value="{{pago.egreso.cuenta.numero}} ({{pago.egreso.cuenta.descripcion}})" disabled="true">
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
      <button mat-button (click)="closeDialog()" [disabled]="form.invalid" type="button">Aceptar</button>
      <button mat-button mat-dialog-close type="button">Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class GenerarChequeNominaComponent implements OnInit, OnDestroy {
  form: FormGroup;
  pago: PagoDeNomina;
  subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<GenerarChequeNominaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.pago = data.pago;
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
      cuenta: [this.pago.egreso.cuenta],
      cheque: [this.pago.egreso.cuenta.proximoCheque]
    });
  }

  closeDialog() {
    this.dialogRef.close({ referencia: this.form.get('cheque').value });
  }
}
