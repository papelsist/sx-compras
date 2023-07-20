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

import { Subject } from 'rxjs';

import { Pago } from '../../model';

@Component({
  selector: 'sx-pago-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pago-form.component.html'
})
export class PagoFormComponent implements OnInit, OnChanges {
  @Input() pago: Pago;
  @Output() save = new EventEmitter<Pago>();
  @Output() aplicar = new EventEmitter<Pago>();
  filtro$ = new Subject<string>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.pago && changes.pago.currentValue) {
      const pag = changes.pago.currentValue;
      this.form.patchValue(pag);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      comentario: []
    });
  }

  onSave() {
    if (this.form.valid) {
      const res = {
        id: this.pago.id,
        ...this.form.value
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }

  onFilter(event: string) {
    this.filtro$.next(event);
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
