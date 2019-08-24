import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { GastoDet } from 'app/cxp/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sx-cxp-gastodet-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-gastodet-modal.component.html',
  styleUrls: ['./cxp-gastodet-modal.component.scss']
})
export class CxPGastodetModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  factura: Partial<CuentaPorPagar>;
  gasto: Partial<GastoDet>;
  destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CxPGastodetModalComponent>,
    private fb: FormBuilder
  ) {
    this.factura = data.factura;
    this.gasto = data.gasto;
    this.buildForm();
  }

  ngOnInit() {
    if (this.gasto) {
      this.form.patchValue(this.gasto);
    }
    this.form
      .get('productoServicio')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.form.get('descripcion').setValue(value.descripcion);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      productoServicio: [null, [Validators.required]],
      cuentaContable: [null, [Validators.required]],
      sucursal: [null, [Validators.required]],
      descripcion: [],
      comentario: [],
      activoFijo: [false, [Validators.required]],
      cantidad: [0, [Validators.required]],
      valorUnitario: [0, [Validators.required]],
      importe: [0, [Validators.required]],
      descuento: [0, [Validators.required]],
      isrRetenido: [0, [Validators.required]],
      ivaRetenido: [0, [Validators.required]],
      ivaTrasladado: [0, [Validators.required]]
    });
  }

  submit() {
    const { cuentaContable, productoServicio, sucursal } = this.form.value;
    const res = {
      ...this.form.value,
      cuentaContable: cuentaContable.id,
      productoServicio: productoServicio.id,
      sucursal: sucursal.id
    };
    this.dialogRef.close(res);
  }
}
