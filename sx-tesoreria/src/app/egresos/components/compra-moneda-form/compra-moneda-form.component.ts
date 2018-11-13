import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

import { CompraMoneda } from '../../models';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import { CompraMonedaService } from 'app/egresos/services';
import * as moment from 'moment';

@Component({
  selector: 'sx-compra-moneda-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content>
      <div layout="column">
        <div layout>
          <mat-form-field flex>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field class="pad-left" flex >
            <mat-select placeholder="Moneda" formControlName="moneda">
              <mat-option *ngFor="let moneda of monedas"
                  [value]="moneda.clave">{{ moneda.descripcion }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field class="pad-left" flex >
            <mat-select placeholder="Forma de pago" formControlName="formaDePago">
              <mat-option *ngFor="let f of ['TRASNFERENCIA']"
                  [value]="f">{{ f }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <sx-cuenta-banco-field formControlName="cuentaOrigen" placeholder="Origen" tipo="CHEQUES"></sx-cuenta-banco-field>
        <sx-cuenta-banco-field formControlName="cuentaDestino" placeholder="Destino"></sx-cuenta-banco-field>
        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Importe" formControlName="importe" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field  class="pad-left" flex>
            <input matInput placeholder="T.C. (Factura)" formControlName="tipoDeCambioCompra" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Importe" formControlName="apagar" type="number" autocomplete="off" >
          </mat-form-field>
        </div>
        <sx-proveedor-field formControlName="proveedor"></sx-proveedor-field>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="T.C (Contable)" formControlName="tipoDeCambio" autocomplete="off" >
          </mat-form-field>
        </div>
        <sx-upper-case-field formControlName="comentario" placeholder="Comentario" ></sx-upper-case-field>

        <td-message label="Error!" sublabel="No puede usar la misma cuenta como origen y destino para el compra"
          color="warn" icon="error" *ngIf="form.get('cuentaDestino').hasError('mismaCuenta')" flex>
        </td-message>
        <td-message label="Error!" sublabel="La moneda de la cuenta destino es incorrecta"
          color="warn" icon="error" *ngIf="form.get('cuentaDestino').hasError('monedaIncorrecta')" flex>
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
export class CompraMonedaFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  compra: Partial<CompraMoneda>;

  destroy$ = new Subject();

  monedas = [
    { clave: 'USD', descripcion: 'DOLARES (USD)' },
    { clave: 'EUR', descripcion: 'EUROS' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CompraMonedaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CompraMonedaService,
    private fb: FormBuilder
  ) {
    this.compra = data.compra;
  }

  ngOnInit() {
    this.buildForm();
    this.importeListener();
    this.fechaListener();
    this.form.patchValue({
      fecha: new Date(),
      moneda: 'USD',
      formaDePago: 'TRASNFERENCIA'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      moneda: [null, [Validators.required]],
      cuentaOrigen: [null, [Validators.required]],
      cuentaDestino: [
        null,
        [
          Validators.required,
          this.validarDestino.bind(this),
          this.validarMoneda.bind(this)
        ]
      ],
      importe: [null, [Validators.required, Validators.min(1)]],
      apagar: [null, [Validators.required]],
      tipoDeCambioCompra: [null, [Validators.required]],
      tipoDeCambio: [null, [Validators.required]],
      proveedor: [null, [Validators.required]],
      referencia: [null],
      comentario: []
    });
  }

  private fechaListener() {
    this.form
      .get('fecha')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(fecha => {
        moment(fecha).subtract('days', 1);
        this.service.buscarTipoDeCambio(fecha).subscribe(
          res => {
            if (res) {
              this.form.get('tipoDeCambio').setValue(res.tipoDeCambio);
            }
          },
          error => {
            this.form.get('tipoDeCambio').setValue(0.0);
            console.error('No existe T.C', error);
          }
        );
      });
  }

  private importeListener() {
    combineLatest(
      this.form.get('importe').valueChanges,
      this.form.get('tipoDeCambioCompra').valueChanges,
      (importe, tipoDeCambio) => {
        return { importe, tipoDeCambio };
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.calcularTotal(res.importe, res.tipoDeCambio);
      });
  }

  private calcularTotal(importe: number, tipoDeCambio: number) {
    const apagar = _.round(importe * tipoDeCambio);
    this.form.get('apagar').setValue(apagar);
  }

  submit() {
    if (this.form.valid) {
      const entity = {
        ...this.form.value,
        fecha: this.form.get('fecha').value.toISOString(),
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

  validarMoneda(control: AbstractControl) {
    if (!this.form) {
      return null;
    }
    if (!this.moneda) {
      return null;
    }
    const destino = control.value;
    if (!destino) {
      return null;
    }
    return destino.moneda === this.moneda ? null : { monedaIncorrecta: true };
  }

  get title() {
    if (this.compra) {
      return `Compra de moneda ${this.compra.id} `;
    } else {
      return 'Compra de moneda extranjera';
    }
  }

  get cuentaOrigen() {
    return this.form.get('cuentaOrigen').value;
  }

  get cuentaDestino() {
    return this.form.get('cuentaDestino').value;
  }

  get moneda() {
    return this.form.get('moneda').value;
  }
}
