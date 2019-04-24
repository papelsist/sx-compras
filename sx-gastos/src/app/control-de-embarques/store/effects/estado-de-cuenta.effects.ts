import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions/estado-cuenta.actions';
import { EstadoDeCuentaService } from '../../services/estado-de-cuenta.service';

@Injectable()
export class EstadoDeCuentaEffects {
  @Effect()
  setFacturista$ = this.actions$.pipe(
    ofType<fromActions.SetFacturista>(
      fromActions.EstadoDeCuentaActionTypes.SetFacturista
    ),
    map(action => action.payload.facturista.id),
    map(facturistaId => new fromActions.LoadEstadoDeCuenta({ facturistaId }))
  );

  @Effect()
  loadEstadoDeCuenta$ = this.actions$.pipe(
    ofType<fromActions.LoadEstadoDeCuenta>(
      fromActions.EstadoDeCuentaActionTypes.LoadEstadoDeCuenta
    ),
    map(action => action.payload.facturistaId),
    switchMap(facturistaId => {
      return this.service.list(facturistaId).pipe(
        map(rows => new fromActions.LoadEstadoDeCuentaSuccess({ rows })),
        catchError(error =>
          of(new fromActions.LoadEstadoDeCuentaFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  generarIntereses$ = this.actions$.pipe(
    ofType<fromActions.GenerarIntereses>(
      fromActions.EstadoDeCuentaActionTypes.GenerarIntereses
    ),
    map(action => action.payload),
    switchMap(data => {
      return this.service.calcularIntereses(data).pipe(
        map(
          rows => new fromActions.GenerarInteresesSuccess({ response: rows })
        ),
        catchError(response =>
          of(new fromActions.GenerarInteresesFail(response))
        )
      );
    })
  );

  @Effect()
  generarNotaDeCargo$ = this.actions$.pipe(
    ofType<fromActions.GenerarNotaDeCargo>(
      fromActions.EstadoDeCuentaActionTypes.GenerarNotaDeCargo
    ),
    map(action => action.payload.facturistaId),
    switchMap(facturistaId => {
      return this.service.generarNotaDeCargo(facturistaId).pipe(
        map(rows => [
          new fromActions.GenerarInteresesSuccess({ response: rows }),
          new fromActions.LoadEstadoDeCuenta({ facturistaId })
        ]),
        catchError(response =>
          of(new fromActions.GenerarInteresesFail(response))
        )
      );
    })
  );

  constructor(
    private actions$: Actions,
    private service: EstadoDeCuentaService
  ) {}
}
