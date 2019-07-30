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

  oficinas = {
    id: '402880fc5e4ec411015e4ec64161012c',
    clave: '1',
    nombre: 'OFICINAS'
  };

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
      sucursal: [null],
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
      const sucursal = this.form.get('sucursal').value || this.oficinas;
      const data = {
        ...this.form.value,
        fecha: new Date(),
        proveedor: id,
        sucursal: sucursal.id
      };
      this.dialogRef.close(data);
    }
  }
}
