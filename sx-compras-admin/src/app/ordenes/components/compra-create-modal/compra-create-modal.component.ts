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
      entrega: [null],
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
      let fecha = this.form.get('fecha').value;
      if (fecha instanceof Date) {
        fecha = fecha.toISOString();
      }
      let entrega = this.form.get('entrega').value;
      if (entrega instanceof Date) {
        entrega = fecha.toISOString();
      }
      const data = {
        ...this.form.value,
        fecha,
        entrega,
        proveedor: id,
        sucursal: sucursal.id
      };
      this.dialogRef.close(data);
    }
  }
}
