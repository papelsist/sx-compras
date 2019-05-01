import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacturistaCargo } from 'app/control-de-embarques/model';

import * as moment from 'moment';

@Component({
  selector: 'sx-cargo-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cargo-form.component.html'
})
export class CargoFormComponent implements OnInit {
  form: FormGroup;
  cargo: Partial<FacturistaCargo>;

  tipos = [
    'MATERIAL',
    'CELULAR',
    'PATIN',
    'MANIOBRA_LOCAL',
    'MANIOBRA_FORANEA',
    'VALES',
    'OTROS'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CargoFormComponent>,
    fb: FormBuilder
  ) {
    this.cargo = data.cargo || {};
    this.form = fb.group({
      facturista: [null, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      tipo: [null, [Validators.required]],
      importe: [0.0, [Validators.required]],
      comentario: [null]
    });

    this.form.patchValue(this.cargo);
    if (this.cargo.id) {
      this.form.get('facturista').disable();
      this.form.get('fecha').setValue(moment(this.cargo.fecha).toDate());
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const fecha: Date = this.form.get('fecha').value;
      const data = {
        ...this.form.value,
        fecha: fecha.toISOString()
      };
      this.dialogRef.close(data);
    }
  }

  get title() {
    return this.cargo.id ? `CARGO: ${this.cargo.id}` : 'ALTA DE OTRO CARGO';
  }
}
