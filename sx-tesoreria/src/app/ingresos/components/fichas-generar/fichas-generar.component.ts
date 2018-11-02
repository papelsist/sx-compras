import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FichaFilter } from '../../models';

@Component({
  selector: 'sx-fichas-generar',
  template: `
  <h2 mat-dialog-title>Generar fichas ({{fecha | date: 'dd/MM/yyyy'}}) </h2>
  <form [formGroup]="form" novalidate (ngSubmit)="onSubmit()">
    <mat-dialog-content>
      <div layout="column">
        <div layout>
          <mat-form-field flex>
            <mat-select placeholder="Cartera" formControlName="tipo">
              <mat-option *ngFor="let tipo of ['CRE','JUR','CHE']" [value]="tipo">
                {{tipo}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <mat-select placeholder="Cartera" formControlName="formaDePago">
              <mat-option *ngFor="let forma of ['CHEQUE','EFECTIVO']" [value]="forma">
                {{forma}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <sx-cuenta-banco-field formControlName="cuenta" [concentradora]="true"></sx-cuenta-banco-field>
      </div>


    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [disabled]="form.invalid">Aceptar</button>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
    </mat-dialog-actions>
  </form>
  `
})
export class FichasGenerarComponent implements OnInit {
  form: FormGroup;
  fecha: Date;
  tipo: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FichasGenerarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fecha = data.fecha;
    this.tipo = data.tipo || 'CRE';
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      tipo: [this.tipo, Validators.required],
      formaDePago: ['CHEQUE', Validators.required],
      cuenta: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const command = {
        ...this.form.value,
        fecha: this.fecha.toISOString(),
        cuenta: this.form.get('cuenta').value.id
      };
      this.dialogRef.close(command);
    }
  }
}
