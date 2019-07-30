import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-requisicion-create',
  templateUrl: './requisicion-create.component.html',
  styleUrls: ['./requisicion-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionCreateComponent implements OnInit {
  form: FormGroup;

  oficinas = {
    id: '402880fc5e4ec411015e4ec64161012c',
    clave: '1',
    nombre: 'OFICINAS'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RequisicionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      proveedor: [null, Validators.required],
      sucursal: [null],
      moneda: ['MXN', Validators.required],
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      comentario: [null]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { clave, nombre, rfc } = this.form.get('proveedor').value;
      const sucursal = this.form.get('sucursal').value || this.oficinas;
      const data = {
        ...this.form.value,
        fecha: new Date(),
        proveedor: nombre,
        clave,
        rfc,
        sucursal: sucursal.nombre
      };
      this.dialogRef.close(data);
    }
  }
}
