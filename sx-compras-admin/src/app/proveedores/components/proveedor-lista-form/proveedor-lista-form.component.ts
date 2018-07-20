import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
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

import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';
import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';
import {
  ListaDePreciosProveedorDet,
  buildPartida
} from '../../models/listaDePreciosProveedorDet';

@Component({
  selector: 'sx-proveedor-lista-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-lista-form.component.html'
})
export class ProveedorListaFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() listaDePrecios: ListaDePreciosProveedor;
  @Input() productos: ProveedorProducto[];
  @Output() save = new EventEmitter<ListaDePreciosProveedor>();
  @Output() cancel = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.listaDePrecios) {
      this.form.patchValue(this.listaDePrecios);
    }
    if (changes.productos && changes.productos.currentValue) {
      changes.productos.currentValue.forEach(item => {
        console.log(item);
        const det: ListaDePreciosProveedorDet = buildPartida(item);
        console.log(det);
        this.partidas.push(new FormControl(det));
      });
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      descripcion: [''],
      ejercicio: [null, [Validators.required]],
      mes: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      partidas: this.fb.array([])
    });
  }

  get proveedor(): Proveedor {
    return this.form.get('proveedor').value;
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get title() {
    return this.listaDePrecios.id
      ? `Lista de precios ${this.listaDePrecios.id}`
      : 'Alta de Lista de precios';
  }
  get subtitle() {
    if (this.listaDePrecios.id) {
      return `Ejercicio ${this.listaDePrecios.ejercicio} Mes: ${
        this.listaDePrecios.mes
      }`;
    } else {
      return 'Actualize los precios de los productos ';
    }
  }

  onUpdateRow(event: ListaDePreciosProveedorDet) {
    this.form.markAsDirty();
  }

  onDeleteRow(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }

  onSubmit() {
    if (this.form.valid) {
      const partidas = this.partidas.value;
      const res = {
        ...this.listaDePrecios,
        ...this.form.value,
        partidas
      };
      this.save.emit(res);
    }
  }
}
