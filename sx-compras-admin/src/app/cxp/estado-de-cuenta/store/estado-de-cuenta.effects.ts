import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';
import * as fromStore from './estado-de-cuenta.reducer';
import * as fromActions from './ecuenta.actions';

import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { EstadoDeCuentaActionTypes } from './ecuenta.actions';

import * as fromServices from '../../services';

import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class EstadoDeCuentaEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.CuentaPorPagarService
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.LoadEstadoDeCuenta>(
      EstadoDeCuentaActionTypes.LoadEstadoDeCuenta
    ),
    map(action => action.payload),
    switchMap(payload =>
      this.service.estadoDeCuenta(payload.proveedorId, payload.periodo).pipe(
        map(res => new fromActions.LoadEstadoDeCuentaSuccess({ data: res })),
        catchError(error =>
          of(new fromActions.LoadEstadoDeCuentaFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  loadFacturas$ = this.actions$.pipe(
    ofType<fromActions.LoadFacturas>(EstadoDeCuentaActionTypes.LoadFacturas),
    map(action => action.payload),
    switchMap(payload =>
      this.service.facturas(payload.proveedorId, payload.periodo).pipe(
        map(facturas => new fromActions.LoadFacturasSuccess({ facturas })),
        catchError(error =>
          of(new fromActions.LoadFacturasFail({ response: error }))
        )
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

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.LoadEstadoDeCuentaFail | fromActions.LoadFacturasFail>(
      EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail,
      EstadoDeCuentaActionTypes.LoadFacturasFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
