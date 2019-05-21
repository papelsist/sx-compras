import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Periodo } from 'app/_core/models/periodo';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';
import { makeParamDecorator } from '@angular/core/src/util/decorators';

@Component({
  selector: 'sx-comisiones-facturista-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h2 mat-dialog-title>{{title}}</h2>
  <mat-dialog-content>
  <div [formGroup]="form">
    <div layout>
      <sx-facturista-field [parent]="form" flex></sx-facturista-field>
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
    <div layout>
      <mat-form-field >
        <input matInput [matDatepicker]="myDatepicker3" placeholder="Fecha corte" formControlName="fechaPago">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker3"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker3></mat-datepicker>
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
export class ComisionesPorFacturistaDialogComponent implements OnInit {
  form: FormGroup;
  title: string;
  periodo: Periodo;
  facturista: FacturistaDeEmbarque;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ComisionesPorFacturistaDialogComponent>,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Comisiones por facturista';
    this.periodo = data.periodo || Periodo.fromNow(90);
    this.facturista = data.facturista;
  }
  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      facturista: [this.facturista, [Validators.required]],
      fechaInicial: [this.periodo.fechaInicial, [Validators.required]],
      fechaFinal: [this.periodo.fechaFinal, [Validators.required]],
      fechaPago: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const fechaPago: Date = this.form.get('fechaPago').value;
      const { facturista } = this.form.value;
      const data = {
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        facturista: facturista.id,
        fechaPago: moment(fechaPago).format('DD/MM/YYYY')
      };
      this.dialogRef.close(data);
    }
  }
}
