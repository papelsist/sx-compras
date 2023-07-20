import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild
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
import { ListaDePreciosProveedorDet } from '../../models/listaDePreciosProveedorDet';

import { Subject } from 'rxjs';
import { ProveedorListaPartidas2Component } from '../proveedor-lista-partidas2/proveedor-lista-partidas2.component';

@Component({
  selector: 'sx-proveedor-lista-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-lista-form.component.html',
  styles: [
    `
      .grid-panel {
        height: 500px;
      }
      mat-card {
        height: calc(100% - 20px);
        display: flex;
        flex-direction: column;
      }
      mat-card-content {
        height: 100%;
        flex-grow: 1;
        overflow: auto;
        // border: 1px solid orange;
      }
    `
  ]
})
export class ProveedorListaFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() listaDePrecios: ListaDePreciosProveedor;
  @Input() productos: ProveedorProducto[];
  @Output() save = new EventEmitter<ListaDePreciosProveedor>();
  @Output() aplicar = new EventEmitter<ListaDePreciosProveedor>();
  @Output() actualizar = new EventEmitter<ListaDePreciosProveedor>();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter<ListaDePreciosProveedor>();
  @Output() print = new EventEmitter<ListaDePreciosProveedor>();
  @Output() actualizarCompras = new EventEmitter<ListaDePreciosProveedor>();
  filter$ = new Subject();

  @ViewChild('grid') grid: ProveedorListaPartidas2Component;

  selected: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.listaDePrecios && changes.listaDePrecios.currentValue) {
      // console.log('Lista de precios: ', changes.listaDePrecios.currentValue);
      this.form.patchValue(this.listaDePrecios);
      changes.listaDePrecios.currentValue.partidas.forEach(item =>
        this.partidas.push(new FormControl(item))
      );
      if (this.listaDePrecios.id) {
        this.form.get('mes').disable();
        this.form.get('ejercicio').disable();
      }
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      descripcion: [''],
      ejercicio: [null, [Validators.required]],
      mes: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      moneda: [{ value: null, disabled: true }, [Validators.required]],
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
    if (!this.listaDePrecios) {
      return '';
    }
    return this.listaDePrecios.id
      ? `Lista de precios ${this.listaDePrecios.id}`
      : 'Alta de Lista de precios';
  }

  get id() {
    return this.listaDePrecios.id;
  }

  onUpdateRow(event: ListaDePreciosProveedorDet) {
    this.form.markAsDirty();
  }
  /*
  onDeleteRow(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }
  */

  onDeleteRow() {
    // this.partidas.removeAt(index);
    this.form.markAsDirty();
  }

  onSubmit() {
    if (this.form.valid) {
      const res = {
        ...this.listaDePrecios,
        ...this.form.value,
        partidas: this.preparePartidas()
      };
      this.save.emit(res);
      // console.log('Salvando: ', res);
      this.form.markAsPristine();
    }
  }

  preparePartidas() {
    // const partidas = [...this.partidas.value];
    const partidas = this.grid.getAllRows();

    // partidas.forEach(item => (item.producto = item.producto.id));
    return partidas;
  }

  onSelection(event: any) {
    this.selected = event;
  }

  onFilter(event: string) {
    this.filter$.next(event.toLowerCase());
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
