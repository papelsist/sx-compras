import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';
import * as fromStore from '../store';

import { Producto } from '../models/producto';

@Injectable()
export class ProductoExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.CatalogosState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.productoId;
        return this.hasProducto(id);
      }),
    );
  }

  hasProducto(id: string): Observable<boolean> {
    return this.store
      .select(fromStore.getProductosEntities)
      .pipe(
        map((entities: { [key: string]: Producto }) => !!entities[id]),
        take(1),
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getProductosLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadProductos());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1), // End the stream
    );
  }
}
