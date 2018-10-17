import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';
import { MovimientoActionTypes } from '../actions/movimientos.actions';
import * as fromActions from '../actions/movimientos.actions';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { CuentasService } from '../../services';

@Injectable()
export class MovimientosEffects {
  constructor(private actions$: Actions, private service: CuentasService) {}

  @Effect()
  loadMovimientos$ = this.actions$.pipe(
    ofType<fromActions.LoadMovimientos>(MovimientoActionTypes.LoadMovimientos),
    map(action => action.payload.cuenta),
    switchMap(cuenta =>
      this.service.loadMovimientos(cuenta).pipe(
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
}
