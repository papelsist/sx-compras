import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { EstadoDeCuentaActionTypes } from '../actions/estado-de-cuenta.actions';
import * as fromActions from '../actions/estado-de-cuenta.actions';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { CuentasService } from '../../services';

@Injectable()
export class EstadoDeCuentaEffects {
  constructor(private actions$: Actions, private service: CuentasService) {}

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
  getFail$ = this.actions$.pipe(
    ofType<fromActions.GetEstadoFail>(EstadoDeCuentaActionTypes.GetEstadoFail),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
