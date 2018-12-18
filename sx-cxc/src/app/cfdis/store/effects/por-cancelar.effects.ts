import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import * as fromRoot from 'app/store';


import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { PorCancelarActionTypes } from '../actions/por-cancelar.actions';
import * as fromActions from '../actions/por-cancelar.actions';
import { CfdisCanceladosService } from '../../services';


@Injectable()
export class PorCancelarEffects {
  constructor(
    private actions$: Actions,
    private service: CfdisCanceladosService) {}

  @Effect()
  loadPorCancelar$ = this.actions$.pipe(
    ofType(PorCancelarActionTypes.LoadCfdisPorCancelar),
    switchMap(action => {
      return this.service.pendientes().pipe(
        map(
          res =>
            new fromActions.LoadCfdisPorCancelarSuccess({ pendientes: res })
        ),
        catchError(error =>
          of(new fromActions.LoadCfdisPorCancelarFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  loadFail$ = this.actions$.pipe(
    ofType<fromActions.LoadCfdisPorCancelarFail>(
      PorCancelarActionTypes.LoadCfdisPorCancelarFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
