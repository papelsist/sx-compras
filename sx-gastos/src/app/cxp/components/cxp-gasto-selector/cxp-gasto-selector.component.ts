import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CuentaPorPagar } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-gasto-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-gasto-selector.component.html',
  styleUrls: ['./cxp-gasto-selector.component.scss']
})
export class CxpGastoSelectorComponent implements OnInit {
  conceptos: any[];
  selected: any[] = [];
  cxp: Partial<CuentaPorPagar>;

  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CxpGastoSelectorComponent>,
    private fb: FormBuilder
  ) {
    this.conceptos = data.conceptos;
    this.cxp = data.cxp;
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      productoServicio: [null, [Validators.required]],
      cuentaContable: [null, [Validators.required]],
      sucursal: [
        {
          id: '402880fc5e4ec411015e4ec64161012c',
          cave: '1',
          nombre: 'OFICINAS'
        },
        [Validators.required]
      ]
    });
    this.form.get('productoServicio').valueChanges.subscribe(val => {
      this.form.get('cuentaContable').setValue(val.cuentaContable);
    });
  }

  onSelection(event: any[]) {
    this.selected = event;
  }

  asignar() {
    const { cuentaContable, productoServicio, sucursal } = this.form.value;
    const gastos = this.selected.map(item => {
      return {
        cxp: this.cxp.id,
        cuentaContable: cuentaContable.id,
        productoServicio: productoServicio.id,
        sucursal: sucursal.id,
        descripcion: productoServicio.descripcion,
        cfdiDet: item.id,
        cfdiUnidad: item.unidad,
        cfdiDescripcion: item.descripcion,
        cantidad: item.cantidad,
        valorUnitario: item.valorUnitario,
        importe: item.importe,
        descuento: item.descuento
      };
    });
    this.dialogRef.close(gastos);
  }
}
