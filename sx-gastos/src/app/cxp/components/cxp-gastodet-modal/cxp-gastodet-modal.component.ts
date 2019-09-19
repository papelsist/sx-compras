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

import * as _ from 'lodash';

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
      .get('cantidad')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.actualizarImportes());
    this.form
      .get('valorUnitario')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.actualizarImportes());

    this.form
      .get('ivaRetenidoTasa')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.actualizarImportes());
    this.form
      .get('ivaTrasladadoTasa')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.actualizarImportes());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      cuentaContable: [null, [Validators.required]],
      sucursal: [null, [Validators.required]],
      descripcion: [],
      comentario: [],
      activoFijo: [false, [Validators.required]],
      cantidad: [0, [Validators.required]],
      valorUnitario: [0, [Validators.required]],
      importe: [0.0, [Validators.required]],
      descuento: [0, [Validators.required]],
      isrRetenido: [0, [Validators.required]],
      isrRetenidoTasa: [0, [Validators.required]],
      ivaRetenido: [0, [Validators.required]],
      ivaRetenidoTasa: [0.0, [Validators.required]],
      ivaTrasladado: [0, [Validators.required]],
      ivaTrasladadoTasa: [0, [Validators.required]],
      serie: [],
      modelo: []
    });
  }

  actualizarImportes() {
    const cantidad = this.form.get('cantidad').value;
    const precio = this.form.get('valorUnitario').value;
    const importe = _.round(cantidad * precio, 2);
    this.form.get('importe').setValue(importe);

    const ivaRetenidoTasa = this.form.get('ivaRetenidoTasa').value;
    const ivaRetenido = _.round(importe * ivaRetenidoTasa, 2);
    this.form.get('ivaRetenido').setValue(ivaRetenido);

    const ivaTrasladadoTasa = this.form.get('ivaTrasladadoTasa').value;
    const ivaTrasladado = _.round(importe * ivaTrasladadoTasa, 2);
    this.form.get('ivaTrasladado').setValue(ivaTrasladado);
  }

  submit() {
    const { cuentaContable, sucursal } = this.form.value;
    const res = {
      ...this.form.getRawValue(),
      cuentaContable: cuentaContable.id,
      sucursal: sucursal.id,
      sucursalNombre: sucursal.nombre
    };
    this.dialogRef.close(res);
  }
  get importe() {
    return this.form.get('importe').value;
  }
}
