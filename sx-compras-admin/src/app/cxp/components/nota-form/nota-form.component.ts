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
  @Input() nota: NotaDeCreditoCxP;
  @Output() save = new EventEmitter<NotaDeCreditoCxP>();
  @Output() aplicar = new EventEmitter<NotaDeCreditoCxP>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.nota && changes.nota.currentValue) {
      console.log('Nota: ', changes.nota.currentValue);
      const not = changes.nota.currentValue;
      this.form.patchValue(not);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      concepto: [null, [Validators.required]],
      comentario: []
    });
  }

  onSave() {
    if (this.form.valid) {
      const res = {
        ...this.nota,
        ...this.form.value
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }
}
