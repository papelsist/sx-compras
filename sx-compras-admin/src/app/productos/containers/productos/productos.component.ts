import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-productos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos.component.html',
  styles: [
    `
      mat-card {
        height: calc(100% - 20px);
        display: flex;
        flex-direction: column;
      }
      .grid-panel {
        height: 100%;
        flex-grow: 1;
        overflow: auto;
      }
    `
  ]
})
export class ProductosComponent implements OnInit {
  productos$: Observable<Producto[]>;
  loading$: Observable<boolean>;
  search$ = new BehaviorSubject('');
  private _storageKey = 'sx-compras.productos';

  constructor(private store: Store<fromStore.CatalogosState>) {}

  ngOnInit() {
    this.loading$ = this.store.select(fromStore.getProductosLoading);
    this.productos$ = this.store.select(fromStore.getAllProductos);

    const lastSearch = localStorage.getItem(this._storageKey + '.filter');
    if (lastSearch) {
      this.search$.next(lastSearch);
    }
  }

  onCreate() {
    this.store.dispatch(new fromRoot.Go({ path: ['productos/create'] }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadProductos());
  }

  onSelect(event: Producto) {
    this.store.dispatch(
      new fromRoot.Go({
        path: ['/catalogos/productos', event.id]
      })
    );
  }

  onSearch(event: string) {
    this.search$.next(event);
    localStorage.setItem(this._storageKey + '.filter', event);
  }
}
