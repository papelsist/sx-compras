import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ComsFilter } from '../../models/recepcionDeCompra';

@Component({
  selector: 'sx-coms-filter-dialog',
  templateUrl: './coms-filter-dialog.component.html'
})
export class ComsFilterDialogComponent implements OnInit {
  title;
  form: FormGroup;
  filter: ComsFilter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Filtro de entradas por compras (COMS)';
    this.filter = data.filter;
  }

  ngOnInit() {
    this.buildForm();
    if (this.filter) {
      this.form.patchValue(this.filter);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null],
      fechaFinal: [null],
      proveedor: [{ value: null, disabled: false }],
      pendientes: [false],
      registros: [
        50,
        [Validators.required, Validators.min(10), Validators.max(500)]
      ]
    });
  }

  toggleProveedor(event) {
    if (event.checked) {
      this.form.get('proveedor').enable();
    } else {
      this.form.get('proveedor').setValue(null);
      this.form.get('proveedor').disable();
    }
  }
}
