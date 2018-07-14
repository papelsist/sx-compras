import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as productosActions from '../actions/proveedorProducto.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ProveedorProductosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ProveedorProductoService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadProveedorProductos$ = this.actions$.pipe(
    ofType<productosActions.LoadProveedorProductos>(
      productosActions.LOAD_PROVEEDOR_PRODUCTOS
    ),
    map(action => action.payload),
    switchMap(proveedorId => {
      return this.service
        .list(proveedorId)
        .pipe(
          map(
            productos =>
              new productosActions.LoadProveedorProductosSuccess(productos)
          ),
          catchError(error =>
            of(new productosActions.LoadProveedorProductosFail(error))
          )
        );
    })
  );

  @Effect()
  updateProveedor$ = this.actions$.pipe(
    ofType<productosActions.UpdateProveedorProducto>(
      productosActions.UPDATE_PROVEEDOR_PRODUCTO_ACTION
    ),
    map(action => action.payload),
    switchMap(proveedor => {
      return this.service
        .update(proveedor)
        .pipe(
          map(res => new productosActions.UpdateProveedorProductoSuccess(res)),
          catchError(error =>
            of(new productosActions.UpdateProveedorProductoFail(error))
          )
        );
    })
  );

  @Effect()
  editProveedorProducto = this.actions$.pipe(
    ofType<productosActions.EditProveedorProducto>(
      productosActions.EDIT_PROVEEDOR_PRODUCTO_ACTION
    ),
    map(action => action.payload),
    map(producto => {
      console.log('Editando proveedor producto: ', producto);
    })
  );
}
