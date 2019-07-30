import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getComprasPeriodo } from '../selectors/compra.selectors';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  catchError,
  take,
  mergeMap
} from 'rxjs/operators';

import { CompraActionTypes } from '../actions/compra.actions';
import * as fromActions from '../actions/compra.actions';
import { ComprasService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';
import { ComprasPeriodoStoeKey } from '../reducers/compra.reducer';

@Injectable()
export class CompraEffects {
  constructor(
    private actions$: Actions,
    private service: ComprasService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  loadCompras$ = this.actions$.pipe(
    ofType(CompraActionTypes.LoadCompras),
    switchMap(() => {
      return this.store.pipe(
        select(getComprasPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(res => new fromActions.LoadComprasSuccess(res)),
        catchError(error => of(new fromActions.LoadComprasFail(error)))
      );
    })
  );

  @Effect()
  periodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodo>(CompraActionTypes.SetPeriodo),
    map(action => action.payload.periodo),
    tap(periodo => Periodo.saveOnStorage(ComprasPeriodoStoeKey, periodo)),
    map(() => new fromActions.LoadCompras())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.GetCompra>(CompraActionTypes.GetCompra),
    map(action => action.payload.id),
    mergeMap(compraId => {
      return this.service.get(compraId).pipe(
        map(compra => new fromActions.UpsertCompra({ compra })),
        catchError(error => of(new fromActions.GetCompraFail(error)))
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.LoadComprasFail>(CompraActionTypes.LoadComprasFail),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
