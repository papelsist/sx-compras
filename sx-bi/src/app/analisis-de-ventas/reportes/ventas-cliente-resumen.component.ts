import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-ventas-clientes-resumen',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Ventas por Cliente
      </h4>

      <div layout>
        <sx-cliente-field formControlName="cliente" tipo="TODOS" flex></sx-cliente-field>
      </div>

      <div layout>
        <mat-form-field flex>
          <input matInput [matDatepicker]="picker" placeholder="Fecha ini" formControlName="fechaIni">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field flex class="pad-left">
          <input matInput [matDatepicker]="picker2" placeholder="Fecha fin" formControlName="fechaFin">
          <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>
      </div>


      <div>
        <mat-form-field flex >
          <mat-select placeholder="Forma" formControlName="origen">
            <mat-option *ngFor="let orden of ['CREDITO', 'CONTADO', 'TODOS']"
              [value]="orden">{{ orden }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>


      <mat-dialog-actions>
        <button mat-button class="accent" type="submit" [disabled]="form.invalid">Aceptar</button>
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </mat-dialog-actions>

    </form>
  `,
  styles: []
})
export class VentasClientesResumenComponent implements OnInit {
  form: FormGroup;
  periodo: Periodo;
  sucursalOpcional: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VentasClientesResumenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const periodo = Periodo.mesActual();
    this.form = this.fb.group({
      fechaIni: [periodo.fechaInicial, Validators.required],
      fechaFin: [new Date(), Validators.required],
      origen: ['CREDITO', Validators.required],
      cliente: [null, Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fechaIni: Date = this.form.get('fechaIni').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const origen = this.form.get('origen').value;
    const cliente: any = this.form.get('cliente').value;
    const res = {
      fechaInicial: fechaIni.toISOString(),
      fechaFinal: fechaFin.toISOString(),
      origen: origen === 'TODOS' ? '%' : origen,
      cliente: cliente.id
    };

    this.dialogRef.close(res);
  }
}
