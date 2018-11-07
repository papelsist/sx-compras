import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Traspaso } from '../../models/traspaso';

import { Subscription, forkJoin } from 'rxjs';

import * as _ from 'lodash';

@Component({
  selector: 'sx-traspaso-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content>
      <div layout="column">
        <sx-cuenta-banco-field formControlName="cuentaOrigen"></sx-cuenta-banco-field>
        <sx-cuenta-banco-field formControlName="cuentaDestino"></sx-cuenta-banco-field>
        <div layout>
          <mat-form-field flex>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Importe" formControlName="importe" type="number" autocomplete="off" >
          </mat-form-field>
        </div>
        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Comision" formControlName="comision" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="IVA" formControlName="impuesto" type="number" autocomplete="off" >
          </mat-form-field>
        </div>
        <sx-upper-case-field formControlName="comentario" placeholder="Comentario"></sx-upper-case-field>

        <td-message label="Error!" sublabel="No puede usar la misma cuenta como origen y destino para el traspaso"
          color="warn" icon="error" *ngIf="form.get('cuentaDestino').hasError('mismaCuenta')" flex>
        </td-message>

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
      .comisiones-panel {
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
export class TraspasoFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  traspaso: Partial<Traspaso>;
  subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<TraspasoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.traspaso = data.traspaso;
  }

  ngOnInit() {
    this.buildForm();
    if (this.traspaso) {
      this.form.patchValue(this.traspaso);
      this.form.get('cuentaOrigen').disable();
      this.form.get('cuentaDestino').disable();
    }
    this.subscription = this.form
      .get('comision')
      .valueChanges.subscribe((importe: number) => {
        if (importe) {
          this.form.get('impuesto').setValue(_.round(importe * 0.16, 2));
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
      fecha: [new Date(), [Validators.required]],
      cuentaOrigen: [null, [Validators.required]],
      cuentaDestino: [
        null,
        [Validators.required, this.validarDestino.bind(this)]
      ],
      importe: [0.0, [Validators.required, Validators.min(1)]],
      comision: [0.0, [Validators.required]],
      impuesto: [0.0, [Validators.required]],
      comentario: []
    });
  }

  submit() {
    if (this.form.valid) {
      const entity = {
        ...this.form.value,
        cuentaOrigen: this.cuentaOrigen.id,
        cuentaDestino: this.cuentaDestino.id
      };
      this.dialogRef.close(entity);
    }
  }

  validarDestino(control: AbstractControl) {
    if (!this.form) {
      return null;
    }
    const destino = control.value;
    const origen = this.cuentaOrigen;
    if (origen) {
      return destino.id === origen.id ? { mismaCuenta: true } : null;
    }
    return null;
  }

  get title() {
    if (this.traspaso) {
      return `Traspaso entre cuetas ${this.traspaso.id} `;
    } else {
      return 'Alta de traspaso entre cuentas';
    }
  }

  get cuentaOrigen() {
    return this.form.get('cuentaOrigen').value;
  }

  get cuentaDestino() {
    return this.form.get('cuentaDestino').value;
  }
}
