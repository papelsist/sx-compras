import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  ErrorStateMatcher
} from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';

import { Subject, merge } from 'rxjs';

import { SolicitudDeDeposito, Cartera } from 'app/cobranza/models';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

const CuentaOrigenValidator: ValidatorFn = (control: AbstractControl) => {
  // Validar cuenta origen
  const { cheque, cuentaOrigen, transferencia } = control.value;
  if (cheque > 0.0) {
    return cuentaOrigen !== null ? null : { cuentaOrigenRequerida: true };
  }
  return null;
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const cuentaOrigen = !!form.hasError('cuentaOrigenRequerida');
    return control.touched && cuentaOrigen;
  }
}

@Component({
  selector: 'sx-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['/solicitud-form.component.scss']
})
export class SolicitudFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  solicitud: Partial<SolicitudDeDeposito>;
  cartera: Cartera;
  destroy$ = new Subject<boolean>();
  matcher = new MyErrorStateMatcher();
  readOnly: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SolicitudFormComponent>,
    private fb: FormBuilder
  ) {
    this.solicitud = data.solicitud || {};
    this.cartera = data.cartera;
    this.readOnly = data.readOnly || false;
    this.form = fb.group(
      {
        cliente: [null, [Validators.required]],
        fecha: [new Date(), [Validators.required]],
        fechaDeposito: [null, [Validators.required]],
        efectivo: [0.0, [Validators.min(0.0)]],
        cheque: [0.0, [Validators.min(0.0)]],
        transferencia: [0.0, [Validators.min(0.0)]],
        cuenta: [null, [Validators.required]],
        banco: [null, [Validators.required]],
        referencia: [null, [Validators.required]],
        cuentaOrigen: [null, []],
        comentario: [{ value: null, disabled: true }, []]
      },
      { validators: [CuentaOrigenValidator] }
    );

    this.form.patchValue(this.solicitud);
    if (this.solicitud.id) {
      this.form.get('fecha').setValue(moment(this.solicitud.fecha).toDate());
      this.form
        .get('fechaDeposito')
        .setValue(moment(this.solicitud.fechaDeposito).toDate());
    }
    if (this.readOnly) {
      this.form.disable();
    }
  }

  buildForm() {}

  ngOnInit() {
    this.form
      .get('transferencia')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.form.get('efectivo').setValue(0.0);
        this.form.get('cheque').setValue(0.0);
      });

    merge(
      this.form.get('efectivo').valueChanges,
      this.form.get('cheque').valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        // this.form.get('transferencia').setValue(0.0);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      const fechaDeposito: Date = this.form.get('fechaDeposito').value;
      const { cliente, cuenta, banco } = this.form.value;
      const data = {
        ...this.form.value,
        fecha: fecha.toISOString(),
        fechaDeposito: fechaDeposito.toISOString(),
        cliente: cliente.id,
        cuenta: cuenta.id,
        banco: banco.id,
        total: this.total,
        tipo: this.cartera.clave
      };
      this.dialogRef.close(data);
    }
  }

  get title() {
    return this.solicitud.id
      ? `SOLICITUD: ${this.solicitud.folio}`
      : 'ALTA DE SOLICITUD DE DEPOSITO';
  }

  get total() {
    const { efectivo, cheque, transferencia } = this.form.value;
    if (transferencia > 0) {
      return _.round(transferencia, 2);
    } else {
      return _.round(efectivo + cheque, 2);
    }
  }
}
