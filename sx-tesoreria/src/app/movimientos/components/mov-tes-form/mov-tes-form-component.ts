import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MovimientoDeTesoreria } from '../../models';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'sx-mov-tes-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content>

      <div layout="column">
        <div layout>
          <mat-form-field flex="50">
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field flex  class="pad-left">
            <mat-select placeholder="Concepto" formControlName="concepto" >
              <mat-option *ngFor="let c of ['ACLARACION', 'CONCILIACION', 'FALTANTE', 'SOBRANTE']"
                  [value]="c">{{ c }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <sx-cuenta-banco-field formControlName="cuenta"
            placeholder="Cuenta" ></sx-cuenta-banco-field>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Importe" formControlName="importe" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
        </div>

        <sx-upper-case-field formControlName="comentario" placeholder="Comentario" flex class="pad-left"></sx-upper-case-field>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">Canelar</button>
      <button mat-button [disabled]="form.invalid || form.pristine" (click)="submit()" *ngIf="!form.disabled">
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
export class MovTesFormComponent implements OnInit {
  form: FormGroup;
  movimiento: Partial<MovimientoDeTesoreria>;
  tipo:'DEPOSITO'| 'RETIRO';

  constructor(
    public dialogRef: MatDialogRef<MovTesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.tipo = data.tipo;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]],
      cuenta: [null, [Validators.required]],
      concepto: [null, [Validators.required]],
      formaDePago: ['TRANSFERENCIA', Validators.required],
      importe: [null, [Validators.required]],
      referencia: [null],
      comentario: []
    });
  }

  submit() {
    if (this.form.valid) {
      const entity = {
        ...this.form.value,
        cuenta: this.form.get('cuenta').value.id,
        fecha: this.form.get('fecha').value.toISOString()
      };
      this.dialogRef.close(entity);
    }
  }

  get title() {
    if (this.movimiento) {
      return `Depósito / Retiro  ${this.movimiento.id} `;
    } else {
      return `Alta de ${this.tipo === 'DEPOSITO' ?'Depósito' : 'Retiro'}` ;
    }
  }
}
