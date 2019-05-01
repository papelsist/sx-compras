import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NotaDeCargo } from 'app/cobranza/models';

@Component({
  selector: 'sx-nota-de-cargo-form',
  templateUrl: './nota-de-cargo-form.component.html',
  styleUrls: ['./nota-de-cargo-form.component.scss']
})
export class NotaDeCargoFormComponent implements OnInit {
  @Input()
  nota: NotaDeCargo;

  @Input()
  disabled = false;

  form: FormGroup;

  @Output()
  save = new EventEmitter<Partial<NotaDeCargo>>();

  @Output()
  print = new EventEmitter<Partial<NotaDeCargo>>();
  @Output()
  email = new EventEmitter<Partial<NotaDeCargo>>();
  @Output()
  xml = new EventEmitter<Partial<NotaDeCargo>>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({});
  }

  onSave() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.save.emit({
        ...formValue
      });
    }
  }
}
