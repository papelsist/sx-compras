import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material';
import { GrupoDeProducto } from '../../models/grupo';

@Component({
  selector: 'sx-grupo-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grupo-form.component.html'
})
export class GrupoFormComponent implements OnInit {
  form: FormGroup;
  grupo: GrupoDeProducto;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.grupo = data.grupo;
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [
        this.grupo ? this.grupo.nombre : null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      descripcion: [
        this.grupo ? this.grupo.descripcion : null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255)
        ]
      ],
      activo: [this.grupo ? this.grupo.activo : true]
    });
  }

  get control() {
    return this.form.get('nombre');
  }

  private hasError(code: string) {
    return this.control.hasError(code);
  }

  getError() {
    if (this.hasError('minlength')) {
      const error = this.control.getError('minlength');
      return `Longitud mínima requerida ${error.requiredLength}`;
    } else if (this.hasError('maxlength')) {
      const error = this.control.getError('maxlength');
      return `Longitud máxima  (${error.requiredLength}) excedida`;
    } else if (this.hasError('required')) {
      return 'Debe digitar un nombre válido';
    }
    return null;
  }
}
