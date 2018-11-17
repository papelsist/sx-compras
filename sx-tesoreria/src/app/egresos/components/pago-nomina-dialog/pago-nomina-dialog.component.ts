import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PagoDeNomina } from '../../models';

import * as moment from 'moment';
import { CuentaDeBanco } from 'app/models';

@Component({
  selector: 'sx-pago-nomina-dialog',
  template: `
  <form [formGroup]="form">
    <span mat-dialog-title layout>
      <span >Pago de la nómina: {{nomina.folio}}</span>
    </span>
    <mat-dialog-content>
      <div layout>
        <mat-form-field flex>
          <input matInput placeholder="Total" value="{{nomina.total | currency}}" [disabled]="true">
        </mat-form-field>
        <mat-form-field class="pad-left" flex>
          <input matInput placeholder="F. Pago" value="{{nomina.formaDePago}}" [disabled]="true">
        </mat-form-field>
      </div>
      <div layout>
        <mat-form-field flex>
          <input matInput placeholder="Empleado" value="{{nomina.empleado}}" [disabled]="true">
        </mat-form-field>
      </div>
      <div layout>
        <mat-form-field flex>
          <input matInput placeholder="A favor" value="{{nomina.afavor}}" [disabled]="true">
        </mat-form-field>
      </div>
      <sx-cuenta-banco-field formControlName="cuenta" disponibleEnPagos="true"></sx-cuenta-banco-field>
      <div layout>
        <mat-form-field flex>
          <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha"
            formControlName="fecha" autocomplete="off">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
        <div layout>
          <mat-form-field class="pad-left" flex>
            <input matInput formControlName="referencia" placeholder="Referencia" autocomplete="off">
          </mat-form-field>
          <mat-form-field class="pad-left" flex *ngIf="nomina.formaDePago === 'CHEQUE'">
            <input matInput formControlName="cheque" placeholder="Próximo cheque" autocomplete="off">
          </mat-form-field>
          <mat-form-field class="pad-left" flex *ngIf="nomina.formaDePago === 'TRANSFERENCIA'">
            <input matInput formControlName="comision" placeholder="Comisión" autocomplete="off">
            <span matPrefix>$&nbsp;</span>
            <mat-hint align="end">Pesos + IVA</mat-hint>
          </mat-form-field>
        </div>
      </div>
      <div layout>
        <mat-slide-toggle [checked]="false" (change)="manual($event)" *ngIf="nomina.formaDePago === 'CHEQUE'">
          Asignación manual de cheque
        </mat-slide-toggle>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class PagoDeNominaDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  nomina: PagoDeNomina;
  subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.nomina = data.pago;
  }

  ngOnInit() {
    this.buildForm();
    this.subscription = this.form.get('cuenta').valueChanges.subscribe(cta => {
      if (this.nomina.formaDePago === 'CHEQUE') {
        this.form.get('cheque').setValue(cta.proximoCheque);
        this.form.get('referencia').setValue(cta.proximoCheque);
        this.form.get('referencia').disable();
      } else {
        this.form.get('referencia').setValue('');
        this.form.get('referencia').enable();
      }
      if (this.nomina.formaDePago === 'TRANSFERENCIA') {
        if (cta.comisionPorTransferencia) {
          this.form.get('comision').setValue(cta.comisionPorTransferencia);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      pagoDeNomina: this.nomina.id,
      fecha: [{ value: this.pago, disabled: true }, [Validators.required]],
      cuenta: [null, Validators.required],
      referencia: [null, Validators.required],
      comision: [{ value: 0.0, disabled: false }],
      cheque: [{ value: null, disabled: true }],
      importe: [null]
    });
  }

  get pago() {
    return moment(this.nomina.pago).toDate();
  }

  manual(event) {
    if (event.checked) {
      this.form.get('referencia').enable();
    } else {
      this.form.get('referencia').disable();
    }
  }
}
