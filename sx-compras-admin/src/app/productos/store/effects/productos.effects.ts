import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import * as productoActions from '../actions/productos.actions';
import * as fromServices from '../../services';

@Injectable()
export class ProductosEffects {
  constructor(
    private actions$: Actions,
    private productosService: fromServices.ProductosService
  ) {}

  @Effect()
  loadProductos$ = this.actions$.ofType(productoActions.LOAD_PRODUCTOS).pipe(
    switchMap(() => {
      return this.productosService
        .list()
        .pipe(
          map(productos => new productoActions.LoadProductosSuccess(productos)),
          catchError(error => of(new productoActions.LoadProductosFail(error)))
        );
    })
  );
}
