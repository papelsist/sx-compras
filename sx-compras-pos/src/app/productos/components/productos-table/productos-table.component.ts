import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Producto } from 'app/productos/models/producto';

@Component({
  selector: 'sx-productos-table',
  templateUrl: './productos-table.component.html',
  styleUrls: ['./productos-table.component.scss']
})
export class ProductosTableComponent implements OnInit, OnChanges {
  @Input() productos: Producto[] = [];

  dataSource = new MatTableDataSource<Producto>(this.productos);

  @Input()
  displayedColumns = [
    'clave',
    'descripcion',
    'unidad',
    'kilos',
    'precioCredito',
    'precioContado',
    'linea',
    'marca',
    'clase'
  ];

  @Output() select = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.productos && changes.productos.currentValue) {
      this.dataSource.data = changes.productos.currentValue;
    }
  }
}
