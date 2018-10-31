import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CobroCheque } from '../../models';

@Component({
  selector: 'sx-cheque-devuelto-form',
  template: `
  <form [formGroup]="form">
    <h2 mat-dialog-title>Alta de cheque devuelto</h2>
    <mat-dialog-content>
      <div layout>
        <mat-form-field flex>
          <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field class="pad-left" flex>
          <input matInput [disabled]="true" value="{{cobro.numero}}" placeholder="Número de cheque">
        </mat-form-field>
        <mat-form-field flex class="pad-left" flex>
          <input matInput [disabled]="true" value="{{cobro.importe | currency}}" placeholder="Nombre">
        </mat-form-field>
      </div>

      <div layout>
        <mat-form-field >
          <input matInput [disabled]="true" value="{{cobro.fecha | date: 'dd/MM/yyyy'}}" placeholder="F. Cobro">
        </mat-form-field>
        <mat-form-field >
          <input matInput [disabled]="true" value="{{cobro.primeraAplicacion | date: 'dd/MM/yyyy'}}" placeholder="Aplicado">
        </mat-form-field>
      </div>

      <div layout>
        <mat-form-field flex>
          <input matInput [disabled]="true" value="{{cobro.nombre}}" placeholder="Nombre">
        </mat-form-field>
      </div>
      <!--
      <sx-upper-case-field formControlName="comentario" placeholder="Comentario"></sx-upper-case-field>
      -->
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Canelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class ChequeDevueltoFormComponent implements OnInit {
  form: FormGroup;
  cobro: CobroCheque;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.cobro = data.cobro;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]]
      // comentario: [null]
    });
  }
}
