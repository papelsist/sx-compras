import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-analisis-trs-dialog',
  templateUrl: './analisis-trs-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalisisTrsDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalisisTrsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      proveedor: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      comentario: [null]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { id, nombre } = this.form.get('proveedor').value;
      const fecha: Date = this.form.get('fecha').value.toISOString();
      const data = {
        ...this.form.value,
        fecha,
        proveedor: id,
        nombre
      };
      this.dialogRef.close(data);
    }
  }
}
