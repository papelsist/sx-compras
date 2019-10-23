import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CuentaActionTypes } from '../actions/cuentas.actions';
import * as fromActions from '../actions/cuentas.actions';

import { CuentasService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CuentasEffects {
  constructor(
    private actions$: Actions,
    private service: CuentasService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadCuentas$ = this.actions$.pipe(
    ofType(CuentaActionTypes.LoadCuentas),
    switchMap(filter =>
      this.service.list().pipe(
        map(cuentas => new fromActions.LoadCuentasSuccess({ cuentas })),
        catchError(error => of(new fromActions.LoadCuentasFail(error)))
      )
    )
  );

  @Effect()
  createCuenta$ = this.actions$.pipe(
    ofType<fromActions.AddCuenta>(CuentaActionTypes.AddCuenta),
    map(action => action.payload.cuenta),
    switchMap(cta => {
      return this.service.save(cta).pipe(
        map(res => new fromActions.AddCuentaSuccess({ cuenta: res })),
        catchError(error =>
          of(new fromActions.AddCuentaFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  updateCuenta$ = this.actions$.pipe(
    ofType<fromActions.UpdateCuenta>(CuentaActionTypes.UpdateCuenta),
    map(action => action.payload.cuenta),
    switchMap(cuenta => {
      return this.service.update(cuenta).pipe(
        map(res => new fromActions.UpdateCuentaSuccess({ cuenta: res })),
        catchError(error => of(new fromActions.UpdateCuentaFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateCuentaSuccess>(
      CuentaActionTypes.UpdateCuentaSuccess
    ),
    map(action => action.payload.cuenta),
    tap(cuenta =>
      this.snackBar.open(`Cuenta ${cuenta.numero} actualizado `, 'Cerrar', {
        duration: 5000
      })
    )
  );
}
