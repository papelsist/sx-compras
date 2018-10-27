import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';

import { Rembolso } from '../../models';

import * as _ from 'lodash';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-rembolso-pago',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rembolso-pago.component.html'
})
export class RembolsoPagoComponent implements OnInit, OnChanges {
  @Input()
  rembolso: Rembolso;

  @Output()
  save = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  form: FormGroup;
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
    if (changes.rembolso && changes.rembolso.currentValue) {
      this.setReembolso();
      this.form.disable();
    }
  }

  setReembolso() {
    this.form.patchValue(this.rembolso);
    this.cleanPartidas();
    this.rembolso.partidas.forEach(det => {
      this.partidas.push(new FormControl(det));
    });
  }

  private buildForm() {
    if (!this.form) {
      this.form = this.fb.group({
        sucursal: [],
        fecha: [],
        fechaDePago: [],
        formaDePago: [],
        comentario: [],
        partidas: this.fb.array([])
      });
    }
  }

  private cleanPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  onSubmit() {
    this.save.emit(this.rembolso);
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }
}
