import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';
import { getSelectedCompra } from '../selectors/compra.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ProductosDisponiblesActionTypes } from '../actions/productos-disponibles.actions';
import * as fromActions from '../actions/productos-disponibles.actions';

import { ComprasService } from '../../services';

@Injectable()
export class ProductosDisponiblesEffects {
  constructor(
    private actions$: Actions,
    private service: ComprasService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  loadDisponibles$ = this.actions$.pipe(
    ofType(ProductosDisponiblesActionTypes.LoadProductosDisponibles),
    switchMap(() => {
      return this.store.pipe(select(getSelectedCompra), take(1));
    }),
    switchMap(compra => {
      return this.service
        .getProductosDisponibles(compra)
        .pipe(
          map(res => new fromActions.LoadProductosDisponiblesSuccess(res)),
          catchError(error =>
            of(new fromActions.LoadProductosDisponiblesFail(error))
          )
        );
    })
  );
}
