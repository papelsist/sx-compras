import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CuentaPorPagar } from '../../model/cuentaPorPagar';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cxp-gastodet-bulkedit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form">
  <span mat-dialog-title>Actualización de gastos</span>
  <mat-divider></mat-divider>
  <div class="pad">
    <sx-cuenta-contable-field
      formControlName="cuentaContable"
    ></sx-cuenta-contable-field>
    <sx-sucursal-field [parent]="form"></sx-sucursal-field>
  </div>

  <mat-dialog-actions>
    <button mat-button [disabled]="form.invalid" (click)="submit()">
      Aceptar
    </button>
    <button mat-button mat-dialog-close type="button">Cancelar</button>
  </mat-dialog-actions>
</form>

  `
})
export class CxPGastodetBulkeditComponent implements OnInit {
  form: FormGroup;
  factura: Partial<CuentaPorPagar>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CxPGastodetBulkeditComponent>,
    private fb: FormBuilder
  ) {
    this.factura = data.factura;
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      cuentaContable: [null],
      sucursal: [null]
    });
  }

  submit() {
    const { cuentaContable, sucursal } = this.form.value;
    const res: any = {};
    if (cuentaContable) {
      res.cuentaContable = cuentaContable.id;
    }
    if (sucursal) {
      res.sucursal = sucursal.id;
      res.sucursalNombre = sucursal.nombre;
    }
    this.dialogRef.close(res);
  }
}
