import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { ProveedorProducto } from '../../models/proveedorProducto';

@Component({
  selector: 'sx-proveedor-productos-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-productos-table.component.html',
  styleUrls: ['./proveedor-productos-table.component.scss']
})
export class ProveedorProductosTableComponent implements OnInit, OnChanges {
  dataSource = new MatTableDataSource<ProveedorProducto>([]);
  @Input() productos: ProveedorProducto[];
  @Input()
  columnsToDisplay = [
    // 'proveedor',
    'clave',
    'descripcion',
    'unidad',
    'claveProveedor',
    'moneda',
    'precioBruto',
    'desc1',
    'desc2',
    'desc3',
    'desc4',
    'precio',
    'operaciones'
  ];
  @Input() search: string;
  @Output() select = new EventEmitter<ProveedorProducto[]>();
  @Output() delete = new EventEmitter<ProveedorProducto>();
  @Output() edit = new EventEmitter<ProveedorProducto>();
  @Output() activar = new EventEmitter<ProveedorProducto>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.productos && changes.productos.currentValue) {
      this.dataSource.data = changes.productos.currentValue;
    }
    if (changes.search && changes.search.currentValue) {
      this.dataSource.filter = changes.search.currentValue;
    }
  }

  toogleSelect(event: ProveedorProducto) {
    event.selected = !event.selected;
    const data = this.productos.filter(item => item.selected);
    this.select.emit([...data]);
  }

  editProducto(event: Event, prod: ProveedorProducto) {
    event.stopPropagation();
    this.edit.emit(prod);
  }

  deleteProducto(event: Event, index: number, prod: ProveedorProducto) {
    event.stopPropagation();
    this.delete.emit(prod);
  }

  activarProducto(event: Event, index: number, prod: ProveedorProducto) {
    event.stopPropagation();
    this.activar.emit(prod);
  }
}
