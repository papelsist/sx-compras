import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Subscription, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Inversion } from '../../models';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'sx-inversion-form',
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
        </div>
        <sx-cuenta-banco-field formControlName="cuentaOrigen" tipo="CHEQUES"
            placeholder="Chequera" ></sx-cuenta-banco-field>
        <sx-cuenta-banco-field formControlName="cuentaDestino" tipo="INVERSION" disponibleEnPagos="false"
            placeholder="Inversión"  ></sx-cuenta-banco-field>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Importe" formControlName="importe" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Tasa" formControlName="tasa" type="number">
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Plazo" formControlName="plazo" type="number">
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field  flex >
            <input matInput placeholder="ISR (%)" formControlName="isr" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="ISR ($)" formControlName="isrImporte" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput [matDatepicker]="vtoPicker" placeholder="Vencimiento" formControlName="vencimiento" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="vtoPicker"></mat-datepicker-toggle>
            <mat-datepicker #vtoPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Rendimiento Calculado" formControlName="rendimientoCalculado" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput [matDatepicker]="rendimientoPicker" placeholder="Rendimiento fecha"
              formControlName="rendimientoFecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="rendimientoPicker"></mat-datepicker-toggle>
            <mat-datepicker #rendimientoPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
          <sx-upper-case-field formControlName="comentario" placeholder="Comentario" flex class="pad-left"></sx-upper-case-field>
        </div>

        <td-message label="Error!" sublabel="No puede usar la misma cuenta como origen y destino para el inversion"
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
export class InversionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  inversion: Partial<Inversion>;
  destroy$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<InversionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.inversion = data.inversion;
  }

  ngOnInit() {
    this.buildForm();
    this.inversionListener();
    this.rendimientoListener();
    if (this.inversion) {
      this.form.patchValue(this.inversion);
      this.form.get('cuentaOrigen').disable();
      this.form.get('cuentaDestino').disable();
      this.form.patchValue(this.inversion);
    } else {
      this.form.patchValue({
        fecha: new Date(),
        tasa: 5.65,
        plazo: 1,
        isr: 0.46
      });
    }
  }

  private inversionListener() {
    this.form
      .get('cuentaDestino')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(cuenta => console.log('Inversion: ', cuenta));
  }

  private rendimientoListener() {
    combineLatest(
      this.form.get('fecha').valueChanges,
      this.form.get('importe').valueChanges,
      this.form.get('tasa').valueChanges,
      this.form.get('plazo').valueChanges,
      this.form.get('isr').valueChanges,
      (fecha, importe, tasa, plazo, isr) => {
        return { fecha, importe, tasa, plazo, isr };
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.calcularVto(res.fecha, res.plazo);
        this.calcularRendimiento(res);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      cuentaOrigen: [null, [Validators.required]],
      cuentaDestino: [
        null,
        [Validators.required, this.validarDestino.bind(this)]
      ],
      importe: [null, [Validators.required, Validators.min(1)]],
      isr: [null, [Validators.required]],
      isrImporte: [0.0, [Validators.required]],
      //
      tasa: [null, [Validators.required]],
      plazo: [null, [Validators.required]],
      vencimiento: [null, [Validators.required]],
      //
      rendimientoCalculado: [],
      // rendimientoReal: [],
      rendimientoFecha: [],
      rendimientoImpuesto: [],
      referencia: [null],
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
    if (this.inversion) {
      return `Inversión  ${this.inversion.id} `;
    } else {
      return 'Alta de inversión';
    }
  }

  get cuentaOrigen() {
    return this.form.get('cuentaOrigen').value;
  }

  get cuentaDestino() {
    return this.form.get('cuentaDestino').value;
  }

  private calcularRendimiento(cfg: {
    importe: number;
    tasa: number;
    plazo: number;
    isr: number;
  }) {
    const { importe, tasa, plazo, isr } = cfg;
    // Calcular rendimiento
    const rendimientoDiario = (importe * (tasa / 100)) / 360;

    const rendimientoBruto = rendimientoDiario * plazo;

    const isrDiario = (importe * (isr / 100)) / 365;
    const isrImporte = _.round(isrDiario * plazo, 2);

    const rendimientoNeto = rendimientoBruto - isrImporte;
    const redimientoCalculado = _.round(rendimientoNeto, 2);

    const rendimientoImpuesto = _.round(redimientoCalculado * 0.16, 2);

    this.form.get('isrImporte').setValue(isrImporte);
    this.form.get('rendimientoCalculado').setValue(redimientoCalculado);
    this.form.get('rendimientoImpuesto').setValue(rendimientoImpuesto);
    // this.form.get('')
  }

  private calcularVto(dia: Date, plazo: number) {
    const fecha = moment(dia);
    const vto = fecha.add(plazo, 'days').toDate();
    this.form.get('vencimiento').setValue(vto);
    this.form.get('rendimientoFecha').setValue(vto);
  }
}
