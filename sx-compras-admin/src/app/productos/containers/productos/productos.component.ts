import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';

import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-productos',
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  productos$: Observable<Producto[]>;
  constructor(private store: Store<fromStore.CatalogosState>) {}

  ngOnInit() {
    this.productos$ = this.store.select(fromStore.getAllProductos);
    this.productos$.subscribe(productos => {
      this.dataSource.data = productos;
    });

    this.store.dispatch(new fromStore.LoadProductos());
  }
}
