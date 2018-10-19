import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  ProveedorPeriodoFilter,
  buildProveedorPeriodoFilter
} from 'app/cxp/model/proveedorPeriodoFilter';

@Component({
  selector: 'sx-proveedor-periodo-filter-dialog',
  templateUrl: './proveedor-periodo-filter-dialog.component.html'
})
export class ProveedorPeriodoFilterDialogComponent implements OnInit {
  title;
  form: FormGroup;
  filter: ProveedorPeriodoFilter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Filtro  ';
    this.filter = data.filter || buildProveedorPeriodoFilter();
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaInicial: [this.filter.fechaInicial, [Validators.required]],
      fechaFinal: [this.filter.fechaFinal, [Validators.required]],
      proveedor: [this.filter.proveedor],
      registros: [
        this.filter.registros,
        [Validators.required, Validators.min(10), Validators.max(500)]
      ]
    });
  }
}
