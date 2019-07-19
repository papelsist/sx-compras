import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as productosActions from '../actions/proveedorProducto.actions';
import * as fromServices from '../../services';

@Injectable()
export class ProveedorProductosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ProveedorProductoService
  ) {}

  @Effect()
  loadProveedorProductos$ = this.actions$.pipe(
    ofType<productosActions.LoadProveedorProductos>(
      productosActions.LOAD_PROVEEDOR_PRODUCTOS
    ),
    map(action => action.payload),
    switchMap(proveedorId => {
      return this.service.list(proveedorId).pipe(
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
}
