import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-proveedor-create-modal',
  templateUrl: './proveedor-create-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class ProveedorCreateModalComponent implements OnInit {
  form: FormGroup;

  tipos = ['COMPRAS', 'GASTOS', 'MIXTO'];

  constructor(
    public dialogRef: MatDialogRef<ProveedorCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      nombre: [null],
      rfc: [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13)
        ]
      ],
      clave: [null, Validators.required],
      tipo: ['COMPRAS', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
