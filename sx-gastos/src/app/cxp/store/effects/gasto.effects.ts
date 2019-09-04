import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import * as fromRoot from 'app/store';
import { GastoActionTypes, GastoActions } from '../actions/gasto.actions';
import * as fromActions from '../actions/gasto.actions';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { GastoDetService } from '../../services/gasto-det.service';

@Injectable()
export class GastoDetEffects {
  constructor(
    private actions$: Actions,
    private service: GastoDetService,
    private store: Store<fromRoot.State>
  ) {}

  @Effect()
  loadNotas$ = this.actions$.pipe(
    ofType<fromActions.LoadGastos>(GastoActionTypes.LoadGastos),
    switchMap(action => {
      return this.service.list(action.payload.facturaId).pipe(
        map(gastos => new fromActions.LoadGastosSuccess({ gastos })),
        catchError(response => of(new fromActions.LoadGastosFail({ response })))
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateGasto>(GastoActionTypes.CreateGasto),
    map(action => action.payload.gasto),
    switchMap(gasto => {
      return this.service.save(gasto).pipe(
        map(res => new fromActions.CreateGastoSuccess({ gasto: res })),
        catchError(error =>
          of(new fromActions.CreateGastoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateGasto>(GastoActionTypes.UpdateGasto),
    map(action => action.payload.gasto),
    switchMap(gasto => {
      return this.service.update(gasto).pipe(
        map(res => new fromActions.UpdateGastoSuccess({ gasto: res })),
        catchError(error =>
          of(new fromActions.UpdateGastoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteGasto>(GastoActionTypes.DeleteGasto),
    map(action => action.payload.gastoId),
    switchMap(gastoId => {
      return this.service.delete(gastoId).pipe(
        map(res => new fromActions.DeleteGastoSuccess({ gastoId })),
        catchError(error => of(new fromActions.LoadGastosFail(error)))
      );
    })
  );

  @Effect()
  prorratearPartida$ = this.actions$.pipe(
    ofType<fromActions.ProrratearPartida>(GastoActionTypes.ProrratearPartida),
    map(action => action.payload),
    switchMap(command => {
      return this.service.prorratearPartida(command).pipe(
        map(gastos => new fromActions.ProrratearPartidaSuccess({ gastos })),
        catchError(response =>
          of(new fromActions.ProrratearPartidaFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadGastosFail
      | fromActions.CreateGastoFail
      | fromActions.UpdateGastoFail
      | fromActions.ProrratearPartidaFail
    >(
      GastoActionTypes.LoadGastosFail,
      GastoActionTypes.CreateGastoFail,
      GastoActionTypes.UpdateGastoFail,
      GastoActionTypes.ProrratearPartidaFail
    ),
    map(action => {
      console.log('Response: ', action.payload.response);
      return new fromRoot.GlobalHttpError({
        response: action.payload.response
      });
    })
  );
}
