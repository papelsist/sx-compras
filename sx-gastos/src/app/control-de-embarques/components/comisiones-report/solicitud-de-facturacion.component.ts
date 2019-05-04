import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Periodo } from 'app/_core/models/periodo';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-solicitud-de-facturacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h2 mat-dialog-title>{{title}}</h2>
  <mat-dialog-content>
  <div [formGroup]="form">
    <div layout>
      <sx-facturista-field [parent]="form" flex></sx-facturista-field>

    </div>
    <div layout>
      <mat-form-field flex  flex>
        <input matInput placeholder="Email" formControlName="email" autocomplete="false" type="email">
      </mat-form-field>
    </div>
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

    <div layout layout-align="center">
      <mat-form-field class="pad-right" >
        <input matInput [matDatepicker]="myDatepicker3" placeholder="F. Timbrado inicial" formControlName="fechaTimbradoInicial">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker3"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker3></mat-datepicker>
      </mat-form-field>
      <span flex></span>
      <mat-form-field >
        <input matInput [matDatepicker]="myDatepicker4" placeholder="F. Timbrado final" formControlName="fechaTimbradoFinal">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker4"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker4></mat-datepicker>
      </mat-form-field>
    </div>



  </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close type="button">CANCELAR</button>
    <button mat-button (click)="onSubmit()" [disabled]="form.invalid" type="button">ACEPTAR</button>
  </mat-dialog-actions>
  `
})
export class SolicitudDeFacturacionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  title: string;
  periodo: Periodo;
  facturista: FacturistaDeEmbarque;
  subs: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SolicitudDeFacturacionComponent>,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Solicitud de facturación';
    this.periodo = data.periodo || Periodo.fromNow(10);
    this.facturista = data.facturista;
  }
  ngOnInit() {
    this.buildForm();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private buildForm() {
    this.form = this.fb.group({
      facturista: [this.facturista, [Validators.required]],
      email: [null, [Validators.required]],
      fechaInicial: [this.periodo.fechaInicial, [Validators.required]],
      fechaFinal: [this.periodo.fechaFinal, [Validators.required]],
      fechaTimbradoInicial: [this.periodo.fechaInicial, [Validators.required]],
      fechaTimbradoFinal: [this.periodo.fechaFinal, [Validators.required]]
    });
    this.subs = this.form.get('facturista').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('email').setValue(val.email);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const fechaTimbradoInicial = moment(this.form.get('fechaInicial').value);
      const fechaTimbradoFinal = moment(this.form.get('fechaFinal').value);

      const { email } = this.form.value;

      const data = {
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        fechaTimbradoInicial: fechaTimbradoInicial.format('DD/MM/YYYY'),
        fechaTimbradoFinal: fechaTimbradoFinal.format('DD/MM/YYYY'),
        email: email
      };

      this.dialogRef.close(data);
    }
  }
}
