import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './estado-de-cuenta.reducer';
import * as fromActions from './ecuenta.actions';
import { selectPeriodo } from './estado-de-cuenta.reducer';

import { map, switchMap, catchError, tap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

import { EstadoDeCuentaActionTypes } from './ecuenta.actions';

import * as fromServices from '../../services';

import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class RequisicionesEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.CuentaPorPagarService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.LoadEstadoDeCuenta>(
      EstadoDeCuentaActionTypes.LoadEstadoDeCuenta
    ),
    // map( action => action.payload),
    switchMap(action =>
      this.service
        .estadoDeCuenta(action.payload.proveedor.id, action.payload.periodo)
        .pipe(
          map(res => new fromActions.LoadEstadoDeCuentaSuccess({ data: res })),
          catchError(error => of(new fromActions.LoadEstadoDeCuentaFail(error)))
        )
    )
  );

  @Effect({ dispatch: false })
  periodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodo>(EstadoDeCuentaActionTypes.SetPeriodo),
    map(action => action.payload.periodo),
    tap(periodo =>
      Periodo.saveOnStorage(fromStore.EstadoDeCuentaPeriodoKey, periodo)
    )
  );

  @Effect({ dispatch: false })
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.LoadEstadoDeCuentaFail>(
      EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
