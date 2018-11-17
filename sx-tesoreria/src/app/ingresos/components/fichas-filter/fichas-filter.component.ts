import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FichaFilter } from 'app/ingresos/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-fichas-filter',
  template: `
  <form [formGroup]="form">
    <div layout class="pad-top">
      <mat-form-field flex >
        <mat-select placeholder="Cartera" formControlName="tipo" >
          <mat-option value="">TODAS</mat-option>
          <mat-option *ngFor="let cartera of ['CRE', 'CON','CHE', 'JUR']"
              [value]="cartera">{{ cartera}}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field flex class="pad-left">
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <sx-sucursal-field [parent]="form" class="pad-left"></sx-sucursal-field>
    </div>
  </form>
  `
})
export class FichasFilterComponent implements OnInit, OnDestroy {
  @Input()
  filter: FichaFilter;
  form: FormGroup;
  @Output()
  aplicar = new EventEmitter();

  subscription: Subscription;

  carteras = [
    { clave: 'CRE', descripcion: 'CREDITO' },
    { clave: 'CON', descripcion: 'CONTADO' },
    { clave: 'COD', descripcion: 'COD' },
    { clave: 'CHE', descripcion: 'CHEQUE' },
    { clave: 'JUR', descripcion: 'JUR' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.filter);
    this.subscription = this.form.valueChanges.subscribe(value =>
      this.aplicar.emit(value)
    );
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      tipo: ['CRE'],
      sucursal: [null]
    });
  }

  doSubmit() {
    if (this.form.valid) {
      this.aplicar.emit(this.form.value);
    }
  }
}
