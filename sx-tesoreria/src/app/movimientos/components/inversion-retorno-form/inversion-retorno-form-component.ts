import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Inversion } from '../../models';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'sx-inversion-retorno-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>Retorno de inversión {{inversion.id}}</h2>
    <mat-dialog-content>
      <div layout="column">
        <mat-form-field>
          <input matInput placeholder="Fecha" value="{{inversion.fecha | date: 'dd/MM/yyyy'}}" [disabled]="true">
        </mat-form-field>
        <div layout>
          <mat-form-field  flex>
            <input matInput placeholder="Chequera" value="{{inversion.origen}}" [disabled]="true">
          </mat-form-field>
        </div>
        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Inversion" value="{{inversion.destino}}" [disabled]="true">
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Importe" value="{{inversion.importe | currency }}" [disabled]="true">
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Tasa" formControlName="tasa" type="number">
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field flex >
            <input matInput placeholder="Plazo" formControlName="plazo" type="number">
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Vencimiento" value="{{inversion.vencimiento | date: 'dd/MM/yyyy'}}" [disabled]="true">
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field  flex >
            <input matInput placeholder="ISR (%)" formControlName="isr" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="ISR ($)" formControlName="isrImporte" type="number" autocomplete="off" >
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Rendimiento Real" formControlName="rendimientoReal" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left" >
            <input matInput placeholder="Rendimiento Calculado" value="{{inversion.rendimientoCalculado | currency}}" [disabled]="true" >
          </mat-form-field>
          <mat-form-field  flex class="pad-left">
            <input matInput [matDatepicker]="rendimientoPicker" placeholder="Rendimiento fecha"
              formControlName="rendimientoFecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="rendimientoPicker"></mat-datepicker-toggle>
            <mat-datepicker #rendimientoPicker></mat-datepicker>
          </mat-form-field>
        </div>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">Canelar</button>
      <button mat-button [disabled]="form.invalid " (click)="submit()" *ngIf="!form.disabled">
        Aceptar
      </button>
    </mat-dialog-actions>
  </form>
  `,
  styles: [
    `
      .impuestos-panel {
        border: 0.5px black solid;
        legend {
          border: 0.5px black solid;
          margin-left: 1em;
          padding: 0.2em 0.8em;
        }
      }
    `
  ]
})
export class InversionRetornoFormComponent implements OnInit {
  form: FormGroup;
  inversion: Partial<Inversion>;

  constructor(
    public dialogRef: MatDialogRef<InversionRetornoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.inversion = data.inversion;
  }

  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.inversion);
    this.form
      .get('rendimientoReal')
      .setValue(this.inversion.rendimientoCalculado);
  }

  private buildForm() {
    this.form = this.fb.group({
      isr: [null, [Validators.required]],
      isrImporte: [null, [Validators.required]],
      tasa: [{ value: null, disabled: true }],
      plazo: [{ value: null, disabled: true }],
      rendimientoReal: [null, [Validators.required]],
      rendimientoFecha: [null],
      rendimientoImpuesto: [],
      referencia: [null],
      comentario: []
    });
  }

  submit() {
    if (this.form.valid) {
      const res = {
        ...this.form.value
        // rendimientoFecha: this.form.get('rendimientoFecha').value.toISOString()
      };
      this.dialogRef.close(res);
    }
  }
}
