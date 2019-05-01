import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FacturistaDeEmbarque } from '../../model';

@Component({
  selector: 'sx-facturista-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facturista-form.component.html'
})
export class FacturistaFormComponent implements OnInit, OnChanges {
  @Input()
  facturista: FacturistaDeEmbarque;
  @Output()
  save = new EventEmitter<FacturistaDeEmbarque>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.facturista && changes.facturista.currentValue) {
      // console.log('Nota: ', changes.facturista.currentValue);
      const not = changes.facturista.currentValue;
      this.form.patchValue(not);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: [null, [Validators.required]],
      rfc: [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13)
        ]
      ]
    });
  }

  onSave() {
    if (this.form.valid) {
      const res = {
        ...this.form.value
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }
}
