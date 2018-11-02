import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Cobro } from '../../models';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-cobros-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content>
      <div layout>
        <mat-form-field flex>
          <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field flex class="pad-left">
          <mat-select placeholder="Cartera" formControlName="tipo">
            <mat-option *ngFor="let tipo of tipos" [value]="tipo.tipo">{{ tipo.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <sx-forma-de-pago [parent]="form" [tipos]="formasValidas" flex></sx-forma-de-pago>
        <mat-form-field class="pad-left" flex>
          <input matInput placeholder="Importe" formControlName="importe" type="number" autocomplete="off" >
        </mat-form-field>
      </div>

      <div layout>
        <sx-cliente-field formControlName="cliente" required="true" flex></sx-cliente-field>
      </div>
      <sx-upper-case-field formControlName="comentario" placeholder="Comentario"></sx-upper-case-field>

      <fieldset class="cheque-panel" *ngIf="isCheque()">
        <legend>Cheque</legend>
        <div formGroupName="cheque">
          <sx-banco-field formControlName="bancoOrigen"></sx-banco-field>
          <div layout>
            <mat-form-field flex>
              <input matInput placeholder="Cuenta" formControlName="numeroDeCuenta" autocomplete="off">
            </mat-form-field>
            <mat-form-field flex class="pad-right">
              <input matInput placeholder="Número" formControlName="numero" type="number" autocomplete="off">
            </mat-form-field>
          </div>
        </div>
      </fieldset>

      <fieldset layout formGroupName="tarjeta" *ngIf="isTarjeta()" class="cheque-panel">
        <legend>Tarjeta Débido/Crédito</legend>
        <mat-form-field flex class="pad-right">
          <input matInput placeholder="Autorización" formControlName="validacion" type="number" autocomplete="off">
        </mat-form-field>
        <mat-checkbox formControlName="visaMaster" class="pad" flex>Visa/MasterCard</mat-checkbox>
      </fieldset>

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
      .cheque-panel {
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
export class CobroFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cobro: Partial<Cobro>;
  subscription: Subscription;

  tipos: Array<{ tipo: string; descripcion: string }> = [
    { tipo: 'CRE', descripcion: 'CREDITO' },
    { tipo: 'JUR', descripcion: 'JURIDICO' },
    { tipo: 'CHE', descripcion: 'CHEQUE_DEVUELTO' },
    { tipo: 'TODOS', descripcion: 'TODAS' }
  ];

  formasValidas = ['EFECTIVO', 'CHEQUE', 'TARJETA_DEBITO', 'TARJETA_CREDITO'];

  constructor(
    public dialogRef: MatDialogRef<CobroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.cobro = data.cobro;
  }

  ngOnInit() {
    this.buildForm();
    if (this.cobro) {
      this.form.patchValue(this.cobro);
      if (this.cobro.aplicado > 0) {
        this.form.disable();
      }
    }
    this.subscription = this.form
      .get('formaDePago')
      .valueChanges.subscribe((val: string) => {
        this.setChildren();
      });

    this.setChildren();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setChildren() {
    const fpago = this.form.get('formaDePago').value;
    switch (fpago) {
      case 'EFECTIVO': {
        this.form.get('cheque').disable();
        this.form.get('tarjeta').disable();
        break;
      }
      case 'CHEQUE': {
        this.form.get('cheque').enable();
        this.form.get('tarjeta').disable();
        break;
      }
      case 'TARJETA_DEBITO':
      case 'TARJETA_CREDITO': {
        this.form.get('cheque').disable();
        this.form.get('tarjeta').enable();
        break;
      }
    }
  }

  submit() {
    if (this.form.valid) {
      const entity = {
        ...this.form.value,
        cliente: this.form.get('cliente').value.id
        // cheque: this.form.get('cheque').value
        // ? this.form.get('cheque').value
        // : undefined
      };
      this.dialogRef.close(entity);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]],
      tipo: ['CRE', [Validators.required]],
      formaDePago: ['CHEQUE', [Validators.required]],
      cliente: [null, [Validators.required]],
      importe: [0.0, [Validators.required, Validators.min(1)]],
      comentario: [],
      cheque: this.fb.group({
        numero: [null, Validators.required],
        bancoOrigen: [null, Validators.required],
        numeroDeCuenta: [null, Validators.required]
      }),
      tarjeta: this.fb.group({
        visaMaster: [true, Validators.required],
        validacion: [null, Validators.required]
      })
    });
  }

  get title() {
    if (this.cobro) {
      return `Cobro de ${this.cobro.nombre} `;
    } else {
      return 'Alta de cobro';
    }
  }

  isTarjeta() {
    return this.form.get('tarjeta').enabled;
  }
  isCheque() {
    return this.form.get('cheque').enabled;
  }
}
