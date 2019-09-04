import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as _ from 'lodash';

import {
  ListaDePreciosVenta,
  ListaDePreciosVentaDet
} from 'app/precios/models';

import { ProductoUtilsService } from 'app/productos/services/productos-utils.service';
import { ListadetTableComponent } from '../listadet-table/listadet-table.component';
import { Update } from '@ngrx/entity';
import { MatDialog } from '@angular/material';
import { ListadetBatchModalComponent } from '../listadet-batch-modal/listadet-batch-modal.component';

@Component({
  selector: 'sx-lista-form',
  templateUrl: './lista-form.component.html',
  styleUrls: ['./lista-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() lista: Partial<ListaDePreciosVenta>;

  _disponibles: { [id: string]: any } = {};

  @Output() save = new EventEmitter<Partial<ListaDePreciosVenta>>();

  @Output() update = new EventEmitter<Update<ListaDePreciosVenta>>();

  partidas: Partial<ListaDePreciosVentaDet>[] = [];
  @ViewChild('partidasTable') grid: ListadetTableComponent;

  selected: Partial<ListaDePreciosVentaDet>[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ProductoUtilsService,
    private dialog: MatDialog
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lista && changes.lista.currentValue) {
    }
  }

  ngOnInit() {
    if (this.lista && this.lista.partidas) {
      this.insertarRegistros(this.lista.partidas);
      this.form.patchValue(this.lista);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      inicio: [null, [Validators.required]],
      descripcion: [null, Validators.required],
      moneda: ['MXN'],
      tipoDeCambio: [1.0, Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      const res = {
        ...this.form.value,
        partidas: this.partidas
      };
      if (this.lista) {
        this.update.emit({ id: this.lista.id, changes: res });
        this.form.markAsPristine();
      } else {
        this.save.emit(res);
        this.form.markAsPristine();
      }
    }
  }

  isValid() {
    return this.form.valid;
  }

  canSave() {
    return this.form.valid && this.form.dirty;
  }

  agregarProductos() {
    this.selectProductos(this.disponibles);
  }

  private selectProductos(productos: any[]) {
    this.service
      .showSelector(productos)
      .afterClosed()
      .subscribe((selection: any[]) => {
        if (selection) {
          const newData = [];
          selection.forEach(item => {
            newData.push(item);
            delete this._disponibles[item.clave];
          });
          const items = [...newData, ...this.partidas];
          this.partidas = items;
          this.grid.gridApi.setRowData(items);
          this.form.markAsDirty();
        }
      });
  }

  onSelection(event: any[]) {
    this.selected = event;
  }

  calcular() {
    this.dialog
      .open(ListadetBatchModalComponent, {
        data: {}
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.modificarPrecios(res);
        }
      });
  }

  private modificarPrecios(command: any) {
    const selection = this.grid.gridApi.getSelectedNodes();
    if (command.tipo === 'CONTADO') {
    }
    selection.forEach(item => {
      const det: Partial<ListaDePreciosVentaDet> = item.data;
      const factor: number = command.factor;
      if (command.tipo === 'CONTADO') {
        const base = det.precioAnteriorContado;
        const precio = command.operador === '/' ? base / factor : base * factor;
        const incremento = precio - base > 0 ? factor : factor * -1;
        det.precioContado = _.round(precio, 0);
        det.incremento = _.round(incremento, 2);
        det.factorContado = _.round(det.precioContado / det.costo, 2);
        item.setData(det);
      } else if (command.tipo === 'CREDITO') {
        const base = det.precioAnteriorCredito;
        const precio = command.operador === '/' ? base / factor : base * factor;
        const incremento = precio - base > 0 ? factor : factor * -1;
        det.precioCredito = _.round(precio, 0);
        det.incremento = _.round(incremento, 2);
        det.factorCredito = _.round(det.precioCredito / det.costo, 2);
        item.setData(det);
      } else {
        const baseCre = det.precioAnteriorCredito;
        const baseCon = det.precioAnteriorContado;
        const precioCre =
          command.operador === '/' ? baseCre / factor : baseCre * factor;
        const precioCon =
          command.operador === '/' ? baseCon / factor : baseCon * factor;
        const incremento = precioCon - baseCon > 0 ? factor : factor * -1;
        det.precioCredito = _.round(precioCre, 0);
        det.precioContado = _.round(precioCon, 0);
        det.incremento = _.round(incremento, 2);
        det.factorCredito = _.round(det.precioCredito / det.costo, 2);
        det.factorContado = _.round(det.precioContado / det.costo, 2);
        item.setData(det);
      }
    });
    this.form.markAsDirty();
  }

  private insertarRegistros(data: any[]) {
    const newData = [];
    data.forEach(item => {
      newData.push(item);
      delete this._disponibles[item.clave];
    });
    const items = [...newData, ...this.partidas];
    this.partidas = items;
    // this.grid.gridApi.setRowData(items);
  }

  deleteSelection() {
    const selectedData = [...this.grid.gridApi.getSelectedRows()];
    this.grid.gridApi.updateRowData({ remove: selectedData });
    selectedData.forEach(item => {
      const index = this.partidas.findIndex(r => r.clave === item.clave);
      _.remove(this.partidas, r => r.clave === item.clave);
    });
    this.form.markAsDirty();
  }

  @Input()
  set disponibles(rows: any[]) {
    const cloneRows = [...rows];
    this._disponibles = _.keyBy(cloneRows, 'clave');
  }

  get disponibles(): any[] {
    return _.valuesIn(this._disponibles);
  }
}
