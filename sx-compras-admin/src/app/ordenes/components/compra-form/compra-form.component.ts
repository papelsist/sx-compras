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
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';

import { Compra } from '../../models/compra';

@Component({
  selector: 'sx-compra-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compra-form.component.html'
})
export class CompraFormComponent implements OnInit, OnChanges {
  @Input() compra: Compra;
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.compra && changes.compra.currentValue) {
      const comp = changes.compra.currentValue;
      this.form.patchValue(comp);
      comp.partidas.forEach(item => this.partidas.push(new FormControl(item)));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      proveedor: [null, [Validators.required]],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }
}
