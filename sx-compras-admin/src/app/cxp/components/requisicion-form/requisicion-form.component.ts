import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Requisicion } from '../../model';

import * as moment from 'moment';

@Component({
  selector: 'sx-requisicion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisicion-form.component.html'
})
export class RequisicionFormComponent implements OnInit {
  @Input() requisicion: Requisicion;
  @Output() save = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    if (this.requisicion) {
      console.log('Editando requisicion: ', this.requisicion);
      this.form.patchValue(this.requisicion);
      /*
      this.form.get('fecha').setValue(moment(this.requisicion.fecha));
      this.form
        .get('fechaDePago')
        .setValue(moment(this.requisicion.fechaDePago));
        */
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      proveedor: [null, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      fechaDePago: [new Date(), [Validators.required]],
      formaDePago: ['TRANSFERENCIA', [Validators.required]],
      moneda: ['MXN', [Validators.required]],
      tipoDeCambio: [1.0, [Validators.required, Validators.min(1)]],
      total: [
        { value: 0.0, disabled: true },
        [Validators.required, Validators.min(1)]
      ],
      comentario: []
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const proveedor: any = this.form.value.proveedor;
      let fecha = this.form.value.fecha;
      if (fecha instanceof Date) {
        fecha = fecha.toISOString();
      }
      let fechaDePago = this.form.value.fechaDePago;
      if (fechaDePago instanceof Date) {
        fechaDePago = fechaDePago.toISOString();
      }
      const entity = {
        ...this.form.value,
        proveedor: { id: proveedor.id },
        fecha,
        fechaDePago
      };
      if (!this.requisicion) {
        this.save.emit(entity);
      } else {
        entity.id = this.requisicion.id;
        // console.log('Salvando requisicion: ', entity);
        this.update.emit(entity);
      }
    }
  }
}
