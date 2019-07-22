import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/productos.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { Producto } from '../models/producto';
import { ProductosService } from '../services';

@Injectable()
export class ProductoExistsGuard implements CanActivate {
  constructor(
    private service: ProductosService,
    private store: Store<fromStore.CatalogosState>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.productoId;
        return this.hasProductoInApi(id);
      })
    );
  }

  hasProductoInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(producto => new fromActions.UpsertProducto(producto)),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload),
      catchError(() => {
        return of(false);
      })
    );
  }
  /*
  hasCompraInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(compra => new fromActions.UpsertCompra({ compra: compra })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.compra),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['ordenes/compras'] }));
        return of(false);
      })
    );
  }
*/
  hasProducto(id: string): Observable<boolean> {
    return this.store.select(fromStore.getProductosEntities).pipe(
      map((entities: { [key: string]: Producto }) => !!entities[id]),
      take(1)
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
      take(1) // End the stream
    );
  }
}
