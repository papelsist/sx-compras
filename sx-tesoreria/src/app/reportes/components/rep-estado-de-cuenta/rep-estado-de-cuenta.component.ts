import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-rep-estado-de-cuenta',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Estado de cuenta bancaria
      </h4>

      <div layout="column" class="selector-form">
        <sx-cuenta-banco-field formControlName="cuenta"></sx-cuenta-banco-field>
        <div layout>
          <mat-form-field flex>
            <input matInput [matDatepicker]="picker" placeholder="Fecha inicial" formControlName="fechaIni">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput [matDatepicker]="picker2" placeholder="Fecha final" formControlName="fechaFin">
            <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </div>
      </div>

      <mat-dialog-actions>
        <button mat-button class="accent" type="submit" [disabled]="form.invalid">Aceptar</button>
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </mat-dialog-actions>

    </form>
  `,
  styles: []
})
export class RepEstadoDeCuentaComponent implements OnInit {
  form: FormGroup;
  periodo: Periodo;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RepEstadoDeCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.periodo = data.periodo;
  }

  ngOnInit() {
    const periodo = this.data.periodo || Periodo.mesActual();
    this.form = this.fb.group({
      fechaIni: [periodo.fechaInicial, Validators.required],
      fechaFin: [new Date(), Validators.required],
      cuenta: [null, [Validators.required]]
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fechaIni: Date = this.form.get('fechaIni').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const cuenta = this.form.get('cuenta').value;
    const res = {
      fechaIni: fechaIni.toISOString(),
      fechaFin: fechaFin.toISOString(),
      cuenta: cuenta.id
    };
    this.dialogRef.close(res);
  }
}
