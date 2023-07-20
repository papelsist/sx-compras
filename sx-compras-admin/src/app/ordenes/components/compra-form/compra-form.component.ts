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
      this.cleanPartidas();
      this.form.patchValue(comp);

      comp.partidas.forEach(item => this.partidas.push(new FormControl(item)));
      if (comp.id) {
        if (this.compra.status === 'A') {
          this.form.disable();
        }
      }
    }
  }

  private cleanPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), [Validators.required]],
      entrega: [],
      moneda: [
        'MXN',
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)]
      ],
      tipoDeCambio: [1.0, [Validators.required, Validators.min(1)]],
      especial: [false, [Validators.required]],
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
      let entrega = this.form.get('entrega').value;
      if (entrega instanceof Date) {
        entrega = entrega.toISOString();
      }
      const proveedor = { id: this.proveedor.id };
      const res = {
        ...this.compra,
        ...this.form.value,
        proveedor,
        fecha,
        entrega,
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
        item.sucursal = this.sucursal.id;
      }
    });
    return partidas;
  }

  onEditPartida(index: number) {
    const control = this.partidas.at(index);
    const det: CompraDet = control.value;
    actualizarPartida(det);
    this.partidas.setControl(index, new FormControl(det));
    this.form.markAsDirty();
  }

  onInsertPartida(event: CompraDet) {
    actualizarPartida(event);
    this.partidas.push(new FormControl(event));
    this.form.markAsDirty();
  }

  onDeletePartida(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }

  onDepurar(index: number) {
    if (this.compra && this.compra.status !== 'A') {
      const control = this.partidas.at(index);
      const partida: CompraDet = { ...control.value };

      partida.depurado = partida.porRecibir;
      partida.depuracion = new Date().toISOString();

      this.partidas.setControl(index, new FormControl(partida));
      this.form.markAsDirty();
    }
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get proveedor() {
    return this.compra.proveedor;
  }
  get moneda() {
    return this.form.get('moneda').value;
  }
  get sucursal() {
    return this.compra.sucursal;
  }
  get status() {
    if (this.compra) {
      return this.compra.status;
    } else {
      return undefined;
    }
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
