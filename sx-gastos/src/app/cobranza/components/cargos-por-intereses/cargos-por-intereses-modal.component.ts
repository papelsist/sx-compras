import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subscription, merge } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';

import * as moment from 'moment';

@Component({
  selector: 'sx-cargos-por-intereses-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form">
    <span mat-dialog-title>Generació de notas de cargo por intereses </span>
    <mat-divider></mat-divider>
    <div layout>
      <mat-form-field flex class="pad-right">
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha inicial" formControlName="fechaInicial">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field flex>
        <input matInput [matDatepicker]="myDatepicker2" placeholder="Fecha final" formControlName="fechaFinal">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker2"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker2></mat-datepicker>
      </mat-form-field>
    </div>
    <div layout>
      <sx-facturista-field2 [parent]="form" flex></sx-facturista-field2>
    </div>
    <div layout>
      <sx-upper-case-field formControlName="descripcion" placeholder="Descripción" flex></sx-upper-case-field>
    </div>

    <mat-dialog-actions>
      <button mat-button [disabled]="form.invalid" (click)="submit()">
        Aceptar
      </button>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
    </mat-dialog-actions>
  </form>

  `
})
export class CargosPorInteresesModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subs: Subscription;
  periodo = Periodo.fromNow(7);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CargosPorInteresesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.buildForm();

    const f1 = this.form.get('fechaInicial').valueChanges;
    const f2 = this.form.get('fechaFinal').valueChanges;
    const t = merge(f1, f2);
    this.subs = t.subscribe(data => {
      const inicial = moment(this.form.get('fechaInicial').value);
      const final = moment(this.form.get('fechaFinal').value);
      const desc = `INTERESES POR PRESTAMO DEL ${inicial.format(
        'DD/MM/YYYY'
      )} al ${final.format('DD/MM/YYYY')}`;
      this.form.get('descripcion').setValue(desc);
    });
    // this.form.patchValue(this.periodo);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaInicial: [null, [Validators.required]],
      fechaFinal: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      facturista: [null]
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const res: any = {
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        descripcion: this.form.get('descripcion').value
      };
      if (this.form.get('facturista').value) {
        res.facturista = { id: this.form.get('facturista').value.id };
      }
      this.dialogRef.close(res);
    }
  }
}
