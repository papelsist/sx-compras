import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { EstadoDeCuentaActionTypes } from '../actions/estado-de-cuenta.actions';
import * as fromActions from '../actions/estado-de-cuenta.actions';

import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { CuentasService } from '../../services';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class EstadoDeCuentaEffects {
  constructor(
    private actions$: Actions,
    private service: CuentasService,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  getEstado$ = this.actions$.pipe(
    ofType<fromActions.GetEstado>(EstadoDeCuentaActionTypes.GetEstado),
    map(action => action.payload),
    switchMap(res =>
      this.service.getEstadoDeCuenta(res.cuenta, res.periodo).pipe(
        map(
          estado => new fromActions.GetEstadoSuccess({ estadoDeCuenta: estado })
        ),
        catchError(response => of(new fromActions.GetEstadoFail({ response })))
      )
    )
  );

  @Effect()
  cerrar$ = this.actions$.pipe(
    ofType<fromActions.CerrarCuenta>(EstadoDeCuentaActionTypes.CerrarCuenta),
    map(action => action.payload),
    switchMap(res =>
      this.service.cerrarCuenta(res.cuenta.id, res.periodo).pipe(
        map(cta => new fromActions.CerrarCuentaSuccess({ cuenta: cta })),
        catchError(response =>
          of(new fromActions.CerrarCuentaFail({ response }))
        )
      )
    )
  );

  @Effect({ dispatch: false })
  cerrarSuccess$ = this.actions$.pipe(
    ofType<fromActions.CerrarCuentaSuccess>(
      EstadoDeCuentaActionTypes.CerrarCuentaSuccess
    ),
    tap(action => {
      this.snackBar.open(
        `Cta: ${action.payload.cuenta.descripcion} cerrada`,
        'Cerrar',
        {
          duration: 8000,
          verticalPosition: 'top'
        }
      );
    })
  );

  @Effect()
  getFail$ = this.actions$.pipe(
    ofType<fromActions.GetEstadoFail | fromActions.CerrarCuentaFail>(
      EstadoDeCuentaActionTypes.GetEstadoFail,
      EstadoDeCuentaActionTypes.CerrarCuentaFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
