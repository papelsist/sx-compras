import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-baja-en-ventas',
  template: `
    <form [formGroup]="form" novalidate (ngSubmit)="doAccept()">
      <h4 md-dialog-title>
        Reporte de baja en Ventas
      </h4>

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
      <div layout>
        <mat-form-field flex >
          <mat-select placeholder="Orden" formControlName="orden">
            <mat-option *ngFor="let orden of ordenes"
              [value]="orden.clave">{{ orden.descripcion }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field flex class="pad-left">
          <mat-select placeholder="Forma" formControlName="forma">
            <mat-option *ngFor="let orden of ['DESC', 'ASC']"
              [value]="orden">{{ orden }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div layout>
        <mat-form-field flex>
          <input matInput placeholder="Dias a considerar:" formControlName="dias" autocomplete="off" type="number">
        </mat-form-field>
        <mat-form-field flex class="pad-left">
          <input matInput placeholder="Venta mayor a" formControlName="valorVenta" autocomplete="off" type="number">
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
        <mat-form-field flex class="pad-left">
          <input matInput placeholder="Porcentaje" formControlName="porcentaje" autocomplete="off" type="number">
        </mat-form-field>
      </div>
      <div layout>
        <sx-sucursal-field [parent]="form" flex></sx-sucursal-field>
      </div>

      <mat-dialog-actions>
        <button mat-button class="accent" type="submit" [disabled]="form.invalid">Aceptar</button>
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </mat-dialog-actions>

    </form>
  `,
  styles: []
})
export class BajaEnVentasComponent implements OnInit {
  form: FormGroup;
  periodo: Periodo;
  title;
  sucursalOpcional: boolean;

  ordenes = [
    { clave: 5, descripcion: 'PROMEDIO' },
    { clave: 7, descripcion: 'PORCENTAJE' },
    { clave: 1, descripcion: 'CLIENTE' },
    { clave: 3, descripcion: 'TIPO' },
    { clave: 6, descripcion: 'PERIODO' },
    { clave: 8, descripcion: 'ULT.VENTA' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BajaEnVentasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title || 'Seleccione periodo y sucursal';
    this.sucursalOpcional = data.sucursalOpcional || true;
  }

  ngOnInit() {
    const periodo = this.data.periodo || Periodo.mesActual();
    this.form = this.fb.group({
      fechaIni: [periodo.fechaInicial, Validators.required],
      fechaFin: [new Date(), Validators.required],
      orden: [5, Validators.required],
      forma: ['DESC', Validators.required],
      dias: [30, Validators.min(30)],
      valorVenta: [50000, [Validators.required]],
      origen: ['CREDITO', Validators.required],
      porcentaje: [10, Validators.min(0.01)],
      sucursal: [null]
    });
    if (!this.sucursalOpcional) {
      console.log('Sucursal obligatoria');
      this.form.get('sucursal').setValidators([Validators.required]);
    }
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    const fechaIni: Date = this.form.get('fechaIni').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const sucursal = this.form.get('sucursal').value;
    const origen = this.form.get('origen').value;
    const res = {
      ...this.form.value,
      fechaInicial: fechaIni.toISOString(),
      fechaFinal: fechaFin.toISOString(),
      sucursal: sucursal ? sucursal.id : '%',
      origen: origen === 'TODOS' ? '%' : origen
    };

    this.dialogRef.close(res);
  }
}
