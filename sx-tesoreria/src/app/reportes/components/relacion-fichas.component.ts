import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FichaFilter, buildFichasFilter } from '../../ingresos/models';

@Component({
  selector: 'sx-relacion-fichas',
  template: `
  <h2 mat-dialog-title>Relación de fichas </h2>
  <form [formGroup]="form" novalidate >
    <mat-dialog-content>
      <div layout="column">
        <mat-form-field >
          <input matInput [matDatepicker]="myDatepicker" formControlName="fecha">
          <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
          <mat-datepicker #myDatepicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field >
          <mat-select placeholder="Cartera" formControlName="origen">
            <mat-option *ngFor="let tipo of ['CRE', 'CON', 'JUR','CHE', 'TODAS']" [value]="tipo">
              {{tipo}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <sx-sucursal-field [parent]="form"></sx-sucursal-field>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="params()" [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class RelacionFichasComponent implements OnInit {
  form: FormGroup;
  filter: FichaFilter;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RelacionFichasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filter = data.filter || buildFichasFilter();
  }
  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [this.filter.fecha, Validators.required],
      origen: [this.filter.tipo, Validators.required],
      sucursal: [this.filter.sucursal, [Validators.required]]
    });
  }

  params() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      return {
        ...this.form.value,
        fecha: fecha.toISOString(),
        sucursal: this.sucursal.id
      };
    }
  }

  get sucursal() {
    return this.form.get('sucursal').value;
  }
}
