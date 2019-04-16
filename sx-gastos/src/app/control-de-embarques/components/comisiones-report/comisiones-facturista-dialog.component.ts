import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'sx-comisiones-facturista-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h2 mat-dialog-title>Comisiones por facturista</h2>
  <mat-dialog-content>
  <div [formGroup]="form">
    <div layout>
      <sx-facturista-field [parent]="form" flex></sx-facturista-field>
    </div>
    <div layout layout-align="center">
      <mat-form-field class="pad-right" >
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha inicial" formControlName="fechaInicial">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <span flex></span>
      <mat-form-field >
        <input matInput [matDatepicker]="myDatepicker2" placeholder="Fecha final" formControlName="fechaFinal">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker2"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker2></mat-datepicker>
      </mat-form-field>
    </div>


  </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close type="button">CANCELAR</button>
    <button mat-button (click)="onSubmit()" [disabled]="form.invalid" type="button">ACEPTAR</button>
  </mat-dialog-actions>
  `
})
export class ComisionesPorFacturistaDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ComisionesPorFacturistaDialogComponent>,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      facturista: [null, [Validators.required]],
      fechaInicial: [new Date(), [Validators.required]],
      fechaFinal: [new Date(), [Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const { facturista } = this.form.value;
      const data = {
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        facturista: facturista.id
      };
      this.dialogRef.close(data);
    }
  }
}
