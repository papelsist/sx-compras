import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Comision } from '../../models';

import * as _ from 'lodash';

@Component({
  selector: 'sx-comision-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-divider></mat-divider>
    <mat-dialog-content>

      <div layout="column" class="pad-top">
        <div layout>
          <mat-form-field flex="50">
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
        </div>
        <sx-cuenta-banco-field formControlName="cuenta"
            placeholder="Cuenta" ></sx-cuenta-banco-field>
        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Comisión" formControlName="comision" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Impuesto tasa" formControlName="impuestoTasa" type="number" autocomplete="off" >
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Impuesto" formControlName="impuesto" type="number" autocomplete="off" >
          </mat-form-field>
        </div>
        <div layout>
          <mat-form-field flex >
            <mat-select placeholder="Concepto" formControlName="concepto" >
              <mat-option *ngFor="let c of conceptos"
                  [value]="c">{{ c }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
        </div>

        <sx-upper-case-field formControlName="comentario" placeholder="Comentario" ></sx-upper-case-field>
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
export class ComisionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  comision: Partial<Comision>;

  destroy$ = new Subject();

  conceptos = [
    'POR_TRANSFERENCIA',
    'CHEQUES_GIRADOS',
    'DIFERENCIA_COMISIONES',
    'CHEQUE_CERTIFICADO',
    'COBU',
    'ANUALIDAD',
    'EXC_PAQ',
    'INT_MDIA',
    'SERV_BCA',
    'TRANSFER_FONDOS',
    'OTROS'
  ];

  constructor(
    public dialogRef: MatDialogRef<ComisionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.impuestoListener();
    this.form.patchValue({ impuestoTasa: 0.16 });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]],
      cuenta: [null, [Validators.required]],
      comision: [null, [Validators.required]],
      impuestoTasa: [null, [Validators.required]],
      impuesto: [null, [Validators.required]],
      concepto: [null, [Validators.required]],
      referencia: [null],
      comentario: []
    });
  }

  private impuestoListener() {
    combineLatest(
      this.form.get('comision').valueChanges,
      this.form.get('impuestoTasa').valueChanges,
      (comision, iva) => {
        return { comision, iva };
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.calcularRendimiento(res.comision, res.iva);
      });
  }

  private calcularRendimiento(comision: number, ivaTasa: number) {
    // Calcular rendimiento
    const iva = comision * ivaTasa;
    this.form.get('impuesto').setValue(iva);
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
    if (this.comision) {
      return `Comisión  ${this.comision.id} `;
    } else {
      return `Alta de comisión bancaria`;
    }
  }
}
