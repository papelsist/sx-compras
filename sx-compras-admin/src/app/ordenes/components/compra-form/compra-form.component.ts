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
import { CompraDet, actualizarPartida } from '../../models/compraDet';

import { ProveedorProducto } from 'app/proveedores/models/proveedorProducto';

@Component({
  selector: 'sx-compra-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.scss']
})
export class CompraFormComponent implements OnInit, OnChanges {
  @Input() compra: Partial<Compra>;
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
      // console.log('Editando compra:', changes.compra.currentValue);
      const comp = changes.compra.currentValue;
      this.clarPartidas();
      this.form.patchValue(comp);

      comp.partidas.forEach(item => this.partidas.push(new FormControl(item)));
      if (comp.id) {
        this.form.get('proveedor').disable();
        this.form.get('moneda').disable();
        if (this.compra.cerrada) {
          this.form.disable();
        }
      }
    }
    // if (changes.productos && changes.productos.currentValue) {
    //   console.log('Productos disponibles: ', changes.productos.currentValue);
    // }
  }

  private clarPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
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
      const proveedor = { id: this.proveedor.id };
      const res = {
        ...this.compra,
        ...this.form.value,
        proveedor,
        fecha,
        ...this.prepararPartidas()
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }

  prepararPartidas(): CompraDet[] {
    const partidas = [...this.partidas.value];
    partidas.forEach(item => {
      if (!item.sucursal) {
        item.sucursal = this.sucursal;
      }
    });
    return partidas;
  }

  onInsertPartida(event: CompraDet) {
    actualizarPartida(event);
    this.partidas.push(new FormControl(event));
    this.form.markAsDirty();
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get proveedor() {
    return this.form.get('proveedor').value;
  }
  get moneda() {
    return this.form.get('moneda').value;
  }
  get sucursal() {
    return this.compra ? this.compra.sucursal : null;
  }
  get status() {
    if (this.compra) {
      return this.compra.status;
    } else {
      return undefined;
    }
  }
}
