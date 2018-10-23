import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { ComprasFilter, buildFilter } from '../../models/compra';

@Component({
  selector: 'sx-compras-filter-dialog',
  templateUrl: './compras-filter-dialog.component.html'
})
export class ComprasFilterDialogComponent implements OnInit, OnDestroy {
  title;
  form: FormGroup;
  filter: ComprasFilter;

  subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title || 'Filtro de compras ';
    this.filter = data.filter;
    if (this.filter.pendientes === true) {
      this.filter = buildFilter(100);
      this.filter.pendientes = true;
    }
  }

  ngOnInit() {
    this.buildForm();
    if (this.filter) {
      this.form.patchValue(this.filter);
    }
    this.subscription = this.form
      .get('pendientes')
      .valueChanges.pipe(startWith(this.form.value.pendientes))
      .subscribe(pendientes => {
        if (pendientes) {
          this.form.get('fechaInicial').disable();
          this.form.get('fechaFinal').disable();
          this.form.get('registros').disable();
          this.form.get('proveedor').disable();
        } else {
          this.form.get('fechaInicial').enable();
          this.form.get('fechaFinal').enable();
          this.form.get('registros').enable();
          this.form.get('proveedor').enable();
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null],
      fechaFinal: [null],
      proveedor: [{ value: null, disabled: false }],
      pendientes: [false],
      registros: [
        100,
        [Validators.required, Validators.min(10), Validators.max(500)]
      ]
    });
  }
}
