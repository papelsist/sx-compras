import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FichaFilter } from 'app/ingresos/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sx-fichas-filter',
  template: `
  <form [formGroup]="form">
    <div layout class="pad-top">
      <mat-form-field flex class="pad-left">
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <sx-sucursal-field [parent]="form" class="pad-left"></sx-sucursal-field>
      <div flex class="pad-left">
        <button mat-button [disabled]="form.invalid && !form.pristine" >Aplicar</button>
      </div>
    </div>
  </form>
  `
})
export class FichasFilterComponent implements OnInit {
  @Input()
  filter: FichaFilter;
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.filter);
  }

  buildForm() {
    this.form = this.fb.group({
      tipo: ['CRE', Validators.required],
      fecha: [new Date(), Validators.required],
      sucursal: [null]
    });
  }
}
