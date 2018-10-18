import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

import { CuentaDeBanco } from 'app/models';

@Component({
  selector: 'sx-cuenta-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cuenta-form.component.html'
})
export class CuentaFormComponent implements OnInit {
  form: FormGroup;
  cuenta: CuentaDeBanco;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.cuenta = data.cuenta;
    this.buildForm();
    console.log('Editando: ', this.cuenta);
  }
  private buildForm() {
    this.form = this.fb.group({
      numero: [null, [Validators.required]],
      descripcion: [
        null,
        [Validators.required, Validators.max(100), Validators.min(10)]
      ],
      bancoSat: [null, [Validators.required]],
      tipo: [null],
      moneda: [null],
      activo: [null],
      disponibleEnPagos: [],
      disponibleEnVentas: [],
      subCuentaOperativa: [],
      impresionTemplate: [],
      proximoCheque: [],
      comisionPorTransferencia: []
    });
  }

  validarImporte(control: AbstractControl) {
    /*
    const importe: number = control.value;
    if (importe <= 0) {
      return { importeInvalido: true };
    }
    return importe <= this.disponible ? null : { importeInvalido: true };
    */
  }

  ngOnInit() {
    if (this.cuenta) {
      this.form.patchValue(this.cuenta);
    }
  }
}
