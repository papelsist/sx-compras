import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacturistaPrestamo } from 'app/control-de-embarques/model';

import * as moment from 'moment';

@Component({
  selector: 'sx-prestamo-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prestamo-form.component.html'
})
export class PrestamoFormComponent implements OnInit {
  form: FormGroup;
  prestamo: Partial<FacturistaPrestamo>;

  tipos = [
    'CAMIONETA',
    'REPARACION',
    'MANTENIMIENTO',
    'PERSONAL',
    'SEGURO',
    'OTROS'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PrestamoFormComponent>,
    fb: FormBuilder
  ) {
    this.prestamo = data.prestamo || {};
    this.form = fb.group({
      facturista: [null, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      autorizo: [null, [Validators.required]],
      autorizacion: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      importe: [0.0, [Validators.required]],
      comentario: [null]
    });

    this.form.patchValue(this.prestamo);
    if (this.prestamo.id) {
      this.form.get('facturista').disable();
      this.form.get('fecha').setValue(moment(this.prestamo.fecha).toDate());
      this.form
        .get('autorizacion')
        .setValue(moment(this.prestamo.autorizacion).toDate());
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      const autorizacion: Date = this.form.get('autorizacion').value;
      const data = {
        ...this.form.value,
        fecha: fecha.toISOString(),
        autorizacion: autorizacion.toISOString()
      };
      this.dialogRef.close(data);
    }
  }

  get title() {
    return this.prestamo.id
      ? `PRESTAMO: ${this.prestamo.id}`
      : 'ALTA DE PRESTAMO';
  }
}
