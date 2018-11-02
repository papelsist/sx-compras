import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sx-relacion-pagos',
  template: `
  <h2 mat-dialog-title>Relación de pagos </h2>
  <form [formGroup]="form" novalidate >
    <mat-dialog-content layout="column">

      <mat-form-field class="pad-left">
        <input matInput [matDatepicker]="myDatepicker" formControlName="fecha">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>

      <mat-form-field class="pad-left">
        <mat-select placeholder="Cartera" formControlName="origen">
          <mat-option *ngFor="let tipo of ['CRE','JUR','CHE']" [value]="tipo">
            {{tipo}}
           </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="pad-left">
        <mat-select placeholder="Cobrador" formControlName="cobrador">
          <mat-option *ngFor="let cobrador of cobradores" [value]="cobrador.id">
            {{cobrador.nombre}}
           </mat-option>
        </mat-select>
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="params()" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class RelacionPagosComponent implements OnInit {
  form: FormGroup;
  cobradores: Array<any> = [
    { id: 0, nombre: 'TODOS' },
    { id: 1, nombre: 'DIRECTO' },
    { id: 2, nombre: 'MARIO SIERRA' },
    { id: 3, nombre: 'ALEJANDRO SIERRA RANGEL' },
    { id: 4, nombre: 'JOSE ENRIQUE ESCALANTE MARTINEZ' },
    { id: 5, nombre: 'JESUS RODRIGUEZ' },
    { id: 6, nombre: 'IVAN ESTRADA MAYA' },
    { id: 7, nombre: 'E. ANTONIO ESCALANTE MAYA' },
    { id: 8, nombre: 'CESAR ESCALANTE MAYA' },
    { id: 9, nombre: 'JOSE ANTONIO GRIJALVA JIMENEZ' }
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RelacionPagosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      origen: ['CRE', Validators.required],
      cobrador: [null]
    });
  }

  ngOnInit() {}

  params() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      const params = { ...this.form.value };
      params.fecha = fecha.toISOString();
      return params;
    }
  }
}
