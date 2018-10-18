import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromCuentas from '../actions/cuentas.actions';
import { MovimientoActionTypes } from '../actions/movimientos.actions';
import * as fromActions from '../actions/movimientos.actions';
import {
  getPeriodo,
  getSelectedCuentaId
} from '../../store/selectors/cuentas.selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { CuentasService } from '../../services';

@Injectable()
export class MovimientosEffects {
  constructor(
    private actions$: Actions,
    private service: CuentasService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  selectedCuenta$ = this.actions$.pipe(
    ofType<fromCuentas.SetSelectedCuenta>(
      fromCuentas.CuentaActionTypes.SetSelectedCuenta
    ),
    map(action => action.payload.cuenta),
    map(() => new fromActions.LoadMovimientos())
  );

  @Effect()
  periodo$ = this.actions$.pipe(
    ofType<fromCuentas.SetPeriodoDeAnalisis>(
      fromCuentas.CuentaActionTypes.SetPeriodoDeAnalisis
    ),
    map(action => action.payload.periodo),
    map(() => new fromActions.LoadMovimientos())
  );

  @Effect()
  loadMovimientos$ = this.actions$.pipe(
    ofType<fromActions.LoadMovimientos>(MovimientoActionTypes.LoadMovimientos),
    withLatestFrom(
      this.store.pipe(select(getSelectedCuentaId)),
      this.store.pipe(select(getPeriodo)),
      (cuenta, cuentaId, periodo) => {
        return {
          cuentaId,
          periodo
        };
      }
    ),
    switchMap(res =>
      this.service.loadMovimientos(res.cuentaId, res.periodo).pipe(
        map(
          movimientos => new fromActions.LoadMovimientosSuccess({ movimientos })
        ),
        catchError(response =>
          of(new fromActions.LoadMovimientosFail({ response }))
        )
      )
    )
  );

  @Effect()
  loadFail$ = this.actions$.pipe(
    ofType<fromActions.LoadMovimientosFail>(
      MovimientoActionTypes.LoadMovimientosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );

  /*
  @Effect()
  selectedCuenta$ = this.actions$.pipe(
    ofType<fromCuentas.SetSelectedCuenta>(
      fromCuentas.CuentaActionTypes.SetSelectedCuenta
    ),
    withLatestFrom(
      this.store.pipe(select(getSelectedCuentaId)),
      this.store.pipe(select(getPeriodo)),
      (cuenta, cuentaId, periodo) => {
        return {
          cuentaId,
          periodo
        };
      }
    ),
    map(
      res =>
        new fromActions.LoadMovimientos()
    )
  );
  */
}
