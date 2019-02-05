import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { ProveedorProducto } from '../../models/proveedorProducto';

@Component({
  selector: 'sx-proveedor-producto-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-producto-form.component.html'
})
export class ProveedorProductoFormComponent implements OnInit {
  producto: ProveedorProducto;
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.producto = data.producto;
  }

  ngOnInit() {
    this.form = this.fb.group({
      claveProveedor: [],
      codigoProveedor: [],
      descripcionProveedor: [],
      paqueteTarima: [],
      piezaPaquete: []
    });
    this.form.patchValue(this.producto);
  }
}
