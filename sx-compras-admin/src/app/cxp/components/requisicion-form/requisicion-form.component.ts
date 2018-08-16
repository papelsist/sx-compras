import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
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

import { Requisicion, CuentaPorPagar } from '../../model';
import { RequisicionDet, fromFactura } from '../../model/requisicionDet';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sx-requisicion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisicion-form.component.html'
})
export class RequisicionFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() requisicion: Requisicion;
  @Input() facturas: CuentaPorPagar[];
  @Output() save = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() cerrar = new EventEmitter();
  @Output() proveedor = new EventEmitter();

  subscription: Subscription;

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.requisicion) {
    } else {
      this.subscription = this.form
        .get('proveedor')
        .valueChanges.subscribe(prov => {
          this.proveedor.emit(prov);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
    if (changes.requisicion && changes.requisicion.currentValue) {
      console.log('Editando requisicion: ', changes.requisicion.currentValue);
      this.setRequisicion();
    }
  }

  setRequisicion() {
    this.form.patchValue(this.requisicion);
    this.cleanPartidas();
    this.requisicion.partidas.forEach(det => {
      this.partidas.push(new FormControl(det));
    });
    if (this.requisicion.cerrada) {
      this.form.disable();
    }
  }

  private buildForm() {
    if (!this.form) {
      this.form = this.fb.group({
        proveedor: [null, [Validators.required]],
        fecha: [new Date(), [Validators.required]],
        fechaDePago: [new Date(), [Validators.required]],
        formaDePago: ['TRANSFERENCIA', [Validators.required]],
        moneda: ['MXN', [Validators.required]],
        tipoDeCambio: [1.0, [Validators.required, Validators.min(1)]],
        descuentof: [0.0, [Validators.min(0.0), Validators.max(100)]],
        total: [
          { value: 0.0, disabled: true },
          [Validators.required, Validators.min(1)]
        ],
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
    if (this.form.valid && !this.form.disabled) {
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

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  onAgregarFactura(selected: CuentaPorPagar[]) {
    selected.forEach(cxp => {
      const det = fromFactura(cxp);
      const found = _.find(this.partidas.value, ['uuid', cxp.uuid]);
      if (!found) {
        this.partidas.push(new FormControl(det));
      }
    });
    this.form.markAsDirty();
  }

  onDeleteRow(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }
  onUpdateRow(event) {
    this.form.markAsDirty();
  }

  get total() {
    return _.sumBy(this.partidas.value, 'total');
  }

  get descuento() {
    if (this.requisicion) {
      return this.requisicion.descuentofImporte;
    } else {
      return 0.0;
    }
  }

  get apagar() {
    if (this.requisicion) {
      return this.requisicion.apagar;
    } else {
      return 0.0;
    }
  }
}
