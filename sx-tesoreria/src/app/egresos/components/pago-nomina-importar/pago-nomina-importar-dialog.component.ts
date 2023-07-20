import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sx-pago-nomina-importar-dialog',
  template: `
  <form [formGroup]="form">
    <h3 mat-dialog-title> Importar pago de nómina </h3>
    <mat-dialog-content>
      <div layout="column">
        <mat-form-field>
          <input matInput formControlName="folio" placeholder="Folio" autocomplete="off">
        </mat-form-field>
        <sx-ejercicio-field [parent]="form"></sx-ejercicio-field>
        <mat-form-field  >
          <mat-select placeholder="Periodicidad" formControlName="periodicidad" >
            <mat-option *ngFor="let p of ['SEMANAL', 'QUINCENAL', 'MENSUAL']"
                [value]="p">{{ p }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field >
          <mat-select placeholder="Tipo" formControlName="tipo" >
            <mat-option *ngFor="let p of ['GENERAL', 'LIQUIDACION', 'AGUINALDO', 'ASIMILADOS', 'PTU', 'ESPECIAL', 'ESPECIAL_PA', 'PTU_COMPLEMENTO']"
                [value]="p">{{ p }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="form.value" [disabled]="form.invalid">IMPORTAR</button>
      <button mat-button mat-dialog-close>CANCELAR</button>
    </mat-dialog-actions>
  </form>
  `
})
export class PagoNominaImportarDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {}

  private buildForm() {
    this.form = this.fb.group({
      folio: [null, Validators.required],
      ejercicio: [2018, Validators.required],
      periodicidad: ['SEMANAL', [Validators.required]],
      tipo: ['GENERAL', [Validators.required]]
    });
  }
}
