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
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      comentario: [null]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { clave, nombre, rfc } = this.form.get('proveedor').value;

      const data = {
        ...this.form.getRawValue,
        fecha: new Date(),
        proveedor: nombre,
        clave,
        rfc
      };
      this.dialogRef.close(data);
    }
  }
}
