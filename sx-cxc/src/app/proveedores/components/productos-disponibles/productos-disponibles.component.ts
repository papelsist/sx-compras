import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatSort,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';

import { Producto } from '../../../productos/models/producto';

@Component({
  selector: 'sx-productos-disponibles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos-disponibles.component.html',
  styleUrls: ['./productos-diponibles.component.scss']
})
export class ProductosDisponiblesComponent implements OnInit {
  productos: Producto[] = [];
  selected: Producto[];
  displayColumns = ['clave', 'descripcion', 'linea', 'clase', 'marca'];
  moneda = 'MXN';
  dataSource = new MatTableDataSource<Producto>([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.productos = data.productos;
    this.moneda = data.moneda;
    this.selected = data.selected || undefined;
  }

  ngOnInit() {
    this.dataSource.data = this.productos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSelection(event: Producto[]) {
    this.selected = event;
  }

  onSearch(event) {
    this.dataSource.filter = event;
  }

  toogleSelect(event: Producto) {
    event.selected = !event.selected;
    const data = this.productos.filter(item => item.selected);
    this.selected = [...data];
  }
}
