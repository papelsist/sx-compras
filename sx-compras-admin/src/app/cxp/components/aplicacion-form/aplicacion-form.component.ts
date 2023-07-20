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

import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-aplicacion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aplicacion-form.component.html'
})
export class AplicacionFormComponent implements OnInit {
  form: FormGroup;
  cxp: CuentaPorPagar;
  disponible: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, fb: FormBuilder) {
    this.cxp = data.cxp;
    this.disponible = data.disponible;
    this.form = fb.group({
      importe: [null, [Validators.required, this.validarImporte.bind(this)]],
      fecha: [new Date(), [Validators.required]],
      comentario: [null]
    });
  }

  validarImporte(control: AbstractControl) {
    const importe: number = control.value;
    if (importe <= 0) {
      return { importeInvalido: true };
    }
    return importe <= this.disponible ? null : { importeInvalido: true };
  }

  ngOnInit() {}

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
