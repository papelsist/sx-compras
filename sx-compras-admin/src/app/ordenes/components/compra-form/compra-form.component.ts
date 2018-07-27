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

import { ProveedorProducto } from 'app/proveedores/models/proveedorProducto';
import { CompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compra-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.scss']
})
export class CompraFormComponent implements OnInit, OnChanges {
  @Input() compra: Compra;
  @Input() productos: ProveedorProducto[];
  @Output() save = new EventEmitter<Partial<Compra>>();
  @Output() delete = new EventEmitter<Compra>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.compra && changes.compra.currentValue) {
      console.log('Editando compra:', changes.compra.currentValue);
      const comp = changes.compra.currentValue;
      this.form.patchValue(comp);
      comp.partidas.forEach(item => this.partidas.push(new FormControl(item)));
      if (comp.id) {
        this.form.get('proveedor').disable();
      }
    }
    // if (changes.productos && changes.productos.currentValue) {
    //   console.log('Productos disponibles: ', changes.productos.currentValue);
    // }
  }

  buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]],
      proveedor: [null, [Validators.required]],
      moneda: [
        'MXN',
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)]
      ],
      tipoDeCambio: [1.0, [Validators.required, Validators.min(1)]],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  onSave() {
    if (this.form.valid) {
      let fecha = this.form.value.fecha;
      if (fecha instanceof Date) {
        fecha = fecha.toISOString();
      }
      const res = {
        ...this.compra,
        ...this.form.value,
        fecha
      };
      this.save.emit(res);
    }
  }

  onInsertPartida(event: CompraDet) {
    console.log('Agregando partida de compra: ', event);
    this.partidas.push(new FormControl(event));
    this.form.markAsDirty();
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get proveedor() {
    return this.form.value.proveedor;
  }
  get moneda() {
    return this.form.value.moneda;
  }
  get status() {
    if (this.compra) {
      return this.compra.status;
    } else {
      return undefined;
    }
  }
}
