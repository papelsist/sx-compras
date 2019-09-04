import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Producto } from 'app/productos/models/producto';

@Component({
  selector: 'sx-productos-table',
  templateUrl: './productos-table.component.html',
  styleUrls: ['./productos-table.component.scss']
})
export class ProductosTableComponent implements OnInit, OnChanges {
  @Input()
  productos: Producto[] = [];

  @Input()
  filter;

  dataSource = new MatTableDataSource<Producto>([]);

  @Input()
  displayColumns = [
    'clave',
    'descripcion',
    'activo',
    'unidad',
    'kilos',
    'precioContado',
    'precioCredito',
    'linea',
    'marca',
    'clase',
    'proveedor'
  ];

  @Output()
  select = new EventEmitter();

  @ViewChild(MatSort)
  sort: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.productos && changes.productos.currentValue) {
      this.dataSource.data = changes.productos.currentValue;
    }
    if (changes.filter) {
      const s: string = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }
}
