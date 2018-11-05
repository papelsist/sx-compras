import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'sx-cobro-tarjeta-dialog',
  templateUrl: './cobro-tarjeta-dialog.component.html',
  styles: []
})
export class CobroTarjetaDialogComponent implements OnInit {
  form: FormGroup;
  cobro: any;

  constructor(
    private dialogRef: MatDialogRef<CobroTarjetaDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cobro = data.cobro;
    this.buildForm();
  }

  ngOnInit() {
    this.form.patchValue(this.cobro);
    this.form.get('importe').setValue(this.cobro.cobro.importe);
  }

  buildForm() {
    this.form = this.fb.group({
      visaMaster: [true, [Validators.required]],
      debitoCredito: [true, [Validators.required]],
      importe: [
        0.0,
        [
          Validators.required,
          Validators.min(1.0),
          this.validarImporte.bind(this)
        ]
      ]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const tarjeta = {
        debitoCredito: false,
        visaMaster: this.form.get('visaMaster').value as boolean
      };
      this.dialogRef.close(this.form.value);
    }
  }

  validarImporte(control: AbstractControl) {
    const importe = control.value;
    const original: number = this.cobro.cobro.importe;
    const diff = original - importe;
    return Math.abs(diff) > 10 ? { importeInvalido: true } : null;
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
