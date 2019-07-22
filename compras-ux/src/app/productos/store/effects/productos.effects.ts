import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import * as productoActions from '../actions/productos.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class ProductosEffects {
  constructor(
    private actions$: Actions,
    private productosService: fromServices.ProductosService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadProductos$ = this.actions$.pipe(
    ofType(productoActions.LOAD_PRODUCTOS),
    switchMap(() => {
      return this.productosService.list().pipe(
        map(productos => new productoActions.LoadProductosSuccess(productos)),
        catchError(error => of(new productoActions.LoadProductosFail(error)))
      );
    })
  );

  @Effect()
  createProducto$ = this.actions$.pipe(
    ofType(productoActions.CREATE_PRODUCTO),
    map((action: productoActions.CreateProducto) => action.payload),
    switchMap(newProduct => {
      return this.productosService.save(newProduct).pipe(
        map(producto => new productoActions.CreateProductoSuccess(producto)),
        catchError(error => of(new productoActions.CreateProductoFail(error)))
      );
    })
  );

  @Effect()
  createProductoSuccess$ = this.actions$.pipe(
    ofType(productoActions.CREATE_PRODUCTO_SUCCESS),
    map((action: productoActions.CreateProductoSuccess) => action.payload),
    map(producto => {
      return new fromRoot.Go({
        path: ['catalogos/productos', producto.id]
      });
    })
  );

  @Effect()
  updateProducto$ = this.actions$.pipe(
    ofType(productoActions.UPDATE_PRODUCTO),
    map((action: productoActions.UpdateProducto) => action.payload),
    switchMap(newProduct => {
      return this.productosService.update(newProduct).pipe(
        map(producto => new productoActions.UpdateProductoSuccess(producto)),
        catchError(error => of(new productoActions.UpdateProductoFail(error)))
      );
    })
  );

  @Effect()
  removeProducto$ = this.actions$.pipe(
    ofType(productoActions.REMOVE_PRODUCTO),
    map((action: productoActions.RemoveProducto) => action.payload),
    switchMap(producto => {
      return this.productosService.delete(producto.id).pipe(
        map(() => new productoActions.RemoveProductoSuccess(producto)),
        catchError(error => of(new productoActions.RemoveProductoFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  handleProductoSuccess$ = this.actions$.pipe(
    ofType<productoActions.UpdateProductoSuccess>(
      productoActions.UPDATE_PRODUCTO_SUCCESS
    ),
    map(action => action.payload),
    tap(producto =>
      this.snackBar.open(`Producto ${producto.clave} actualizado `, 'Cerrar', {
        duration: 5000
      })
    )
  );

  @Effect()
  searchProductos$ = this.actions$.pipe(
    ofType(productoActions.SEARCH_PRODUCTOS),
    map((action: productoActions.SearchProductos) => action.payload),
    switchMap(criteria => {
      return this.productosService.list(criteria).pipe(
        map(res => new productoActions.SearchProductosSuccess(res)),
        catchError(error => of(new productoActions.SearchProductosFail(error)))
      );
    })
  );
}
