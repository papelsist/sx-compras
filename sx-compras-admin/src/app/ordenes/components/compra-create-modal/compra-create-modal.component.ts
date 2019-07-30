import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-compra-create-modal',
  templateUrl: './compra-create-modal.component.html',
  styleUrls: ['./compra-create-modal.component.scss']
})
export class CompraCreateModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CompraCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      proveedor: [null, Validators.required],
      moneda: ['MXN', Validators.required],
      tipoDeCambio: [1.0, Validators.required],
      comentario: [null]
    });
  }

  submit() {
    if (this.form.valid) {
      const { id } = this.form.get('proveedor').value;

      const data = {
        ...this.form.value,
        fecha: new Date(),
        proveedor: id
      };
      this.dialogRef.close(data);
    }
  }
}
