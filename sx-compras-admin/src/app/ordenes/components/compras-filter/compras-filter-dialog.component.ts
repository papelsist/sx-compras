import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComprasFilter } from '../../models/compra';

@Component({
  selector: 'sx-compras-filter-dialog',
  templateUrl: './compras-filter-dialog.component.html'
})
export class ComprasFilterDialogComponent implements OnInit {
  title;
  form: FormGroup;
  filter: ComprasFilter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Filtro de compras ';
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
}
