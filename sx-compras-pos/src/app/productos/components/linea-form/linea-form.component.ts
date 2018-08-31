import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material';
import { Linea } from '../../models/linea';

@Component({
  selector: 'sx-linea-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './linea-form.component.html'
})
export class LineaFormComponent implements OnInit {
  form: FormGroup;
  linea: Linea;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.linea = data.linea;
  }

  ngOnInit() {
    this.form = this.fb.group({
      linea: [
        this.linea ? this.linea.linea : null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      activa: [this.linea ? this.linea.activa : true]
    });
  }

  get control() {
    return this.form.get('linea');
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
