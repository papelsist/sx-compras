import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { FacturistaDeEmbarque } from '../../model';

export function tasaValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log('Evaluando: ', control.value);
    return control.value > 0.0
      ? null
      : { tasaInvalida: { value: control.value } };
  };
}

@Component({
  selector: 'sx-prestamo-intereses-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>{{title}}</h2>
    <mat-dialog-content>
      <div layout="column">
        <mat-form-field flex>
          <input matInput [matDatepicker]="myDatepicker" placeholder="Corte" formControlName="corte" autocomplete="off">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <input matInput type="number" formControlName="tasa" autocomplete="OFF" placeholder="Tasa de interes (CETES)">
        </mat-form-field>

      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [disabled]="form.invalid" (click)="onSubmit()">Aceptar</button>
      <button mat-button mat-dialog-close type="button">Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class PrestamoInteresesFormComponent implements OnInit {
  form: FormGroup;
  facturista: FacturistaDeEmbarque;

  constructor(
    private dialogRef: MatDialogRef<PrestamoInteresesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.facturista = data.facturista;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      corte: [new Date(), [Validators.required]],
      tasa: [
        0.0,
        [Validators.required, Validators.min(0.01), Validators.max(10.0)]
      ]
    });
  }

  get title() {
    if (this.facturista) {
      return `CALCULO DE INTERESES PARA: ${this.facturista.nombre}`;
    } else {
      return 'CALCULO DE INTERESES GLOBALES';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const corte: Date = this.form.get('corte').value;

      this.dialogRef.close({
        ...this.form.value,
        corte: corte.toISOString(),
        facturista: this.facturista ? this.facturista.id : null
      });
    }
  }
}
