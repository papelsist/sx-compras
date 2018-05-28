import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-productos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent implements OnInit {
  productos$: Observable<Producto[]>;
  constructor(private store: Store<fromStore.CatalogosState>) {}

  ngOnInit() {
    this.productos$ = this.store.select(fromStore.getAllProductos);
  }

  onSelect(event: Producto) {
    this.store.dispatch(
      new fromRoot.Go({
        path: ['/productos/productos', event.id]
      })
    );
  }
}
