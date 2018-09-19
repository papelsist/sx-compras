import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material';
import { Marca } from '../../models/marca';

@Component({
  selector: 'sx-marca-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marca-form.component.html'
})
export class MarcaFormComponent implements OnInit {
  form: FormGroup;
  marca: Marca;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.marca = data.marca;
  }

  ngOnInit() {
    this.form = this.fb.group({
      marca: [
        this.marca ? this.marca.marca : null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)]
      ]
    });
  }

  get control() {
    return this.form.get('marca');
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
