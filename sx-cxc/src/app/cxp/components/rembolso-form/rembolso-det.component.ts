import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RembolsoDet } from 'app/cxp/model';

@Component({
  selector: 'sx-aplicacion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form">
    <span mat-dialog-title>Reembolso especial (NO DEDUCIBLE)</span>
    <div mat-dialog-content>
      <div>
        <mat-form-field flex>
          <input matInput placeholder="Documento" formControlName="documentoFolio">
        </mat-form-field>
        <mat-form-field class="pad-left">
          <input matInput [matDatepicker]="myDatepicker" formControlName="documentoFecha" placeholder="Fecha">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
      </div>
      <div layout>
        <mat-form-field flex>
          <mat-select placeholder="Concepto" formControlName="concepto" >
            <mat-option *ngFor="let concepto of ['NO_DEDUCIBLE']"
                [value]="concepto">{{ concepto}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field  class="pad-left">
          <input matInput placeholder="Total" formControlName="total" type="number" autocomplete="off">
        </mat-form-field>
      </div>
      <sx-upper-case-field placeholder="Comentario" formControlName="comentario"></sx-upper-case-field>
    </div>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class RembolsoDetComponent implements OnInit {
  form: FormGroup;
  partida: RembolsoDet;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.partida = data.partida;
  }

  ngOnInit() {
    this.buildForm();
    if (this.partida) {
      this.form.patchValue(this.partida);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      total: [null, [Validators.required]],
      documentoFecha: [new Date(), [Validators.required]],
      documentoFolio: [],
      comentario: [null],
      concepto: ['NO_DEDUCIBLE'],
      nombre: ['GASTO NO DEDUCIBLE']
    });
  }
}
