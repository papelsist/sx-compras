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

import { NotaDeCreditoCxP, NotaDeCreditoCxPDet } from '../../model';

@Component({
  selector: 'sx-nota-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nota-form.component.html',
  styleUrls: ['./nota-form.component.scss']
})
export class NotaFormComponent implements OnInit, OnChanges {
  @Input() nota: Partial<NotaDeCreditoCxP>;
  @Output() save = new EventEmitter<NotaDeCreditoCxP>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.nota && changes.nota.currentValue) {
      // console.log('Editando compra:', changes.compra.currentValue);
      const not = changes.nota.currentValue;
      this.clarPartidas();
      this.form.patchValue(not);
      // comp.partidas.forEach(item => this.partidas.push(new FormControl(item)));
    }
  }

  private clarPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      concepto: [null, [Validators.required]],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  onSave() {
    if (this.form.valid) {
      const res = {
        ...this.nota,
        ...this.form.value,
        ...this.prepararPartidas()
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }

  prepararPartidas(): NotaDeCreditoCxPDet[] {
    const partidas = [...this.partidas.value];
    partidas.forEach(item => {});
    return partidas;
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }
}
