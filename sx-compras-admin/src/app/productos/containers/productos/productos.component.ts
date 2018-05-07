import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';

import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-productos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos.component.html',
  styles: [],
})
export class ProductosComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  productos$: Observable<Producto[]>;
  constructor(
    private store: Store<fromStore.CatalogosState>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.productos$ = this.store.select(fromStore.getAllProductos);
    this.productos$.subscribe(productos => {
      this.dataSource.data = productos;
    });

    // this.store.dispatch(new fromStore.LoadProductos());
  }

  onSelect(row) {
    this.router.navigate(['/productos/productos', row.id]);
  }
}
