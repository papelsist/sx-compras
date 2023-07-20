import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Update } from '@ngrx/entity';

import { AnalisisDeTransformacion } from 'app/cxp/model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sx-analisis-trs-form',
  templateUrl: './analisis-trs.form.component.html'
})
export class AnalisisTrsFormComponent implements OnInit {
  @Input() analisis: AnalisisDeTransformacion;

  @Output() update = new EventEmitter<Update<AnalisisDeTransformacion>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.form.patchValue(this.analisis);
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      comentario: [null, [Validators.required]],
      manual: [null]
    });
  }

  onSubmit() {
    let d = this.form.get('fecha').value;
    if (d instanceof Date) {
      d = d.toISOString();
    }
    const res = {
      ...this.form.value,
      fecha: d
    };
    this.update.emit({ id: this.analisis.id, changes: res });
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
