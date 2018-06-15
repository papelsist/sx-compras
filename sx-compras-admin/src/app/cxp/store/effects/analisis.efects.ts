import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as analisisActions from '../actions/analisis.actions';
import {
  AnalisisActionTypes,
  AnalisisActions
} from '../actions/analisis.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

@Injectable()
export class AnalisisEffects {
  constructor(
    private actions$: Actions,
    private analisisService: fromServices.AnalisisService,
    private cuentaPorPagarSercice: fromServices.CuentaPorPagarService
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<analisisActions.Load>(AnalisisActionTypes.LOAD),
    switchMap(() => {
      return this.analisisService
        .list({})
        .pipe(
          map(res => new analisisActions.LoadSuccess(res)),
          catchError(error => of(new analisisActions.SaveAnalisisFail(error)))
        );
    })
  );

  @Effect()
  save$ = this.actions$.pipe(
    ofType<analisisActions.SaveAnalisis>(
      analisisActions.AnalisisActionTypes.SAVE_ANALISIS
    ),
    map(action => action.payload),
    switchMap(analisis => {
      return this.analisisService
        .save(analisis)
        .pipe(
          map(res => new analisisActions.SaveAnalisisSuccess(res)),
          catchError(error => of(new analisisActions.SaveAnalisisFail(error)))
        );
    })
  );

  @Effect()
  setCurrentProveedor$ = this.actions$.pipe(
    ofType<analisisActions.SetCurrentProveedor>(
      analisisActions.AnalisisActionTypes.SET_CURRENT_PROVEEDOR
    ),
    map(action => new analisisActions.LoadFacturasPendientes(action.payload))
  );

  @Effect()
  loadPendientesDelProveedor$ = this.actions$.pipe(
    ofType<analisisActions.LoadFacturasPendientes>(
      analisisActions.AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES
    ),
    map(action => action.payload),
    switchMap(proveedor => {
      return this.cuentaPorPagarSercice
        .pendientesDeAnalizar(proveedor.id)
        .pipe(
          map(
            facturas =>
              new analisisActions.LoadFacturasPendientesSuccess(facturas)
          ),
          catchError(error =>
            of(new analisisActions.LoadFacturasPendientesFail(error))
          )
        );
    })
  );
}
