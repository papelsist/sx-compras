import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as analisisActions from '../actions/analisis.actions';
import { AnalisisActionTypes } from '../actions/analisis.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class AnalisisEffects {
  constructor(
    private actions$: Actions,
    private analisisService: fromServices.AnalisisService,
    private cuentaPorPagarSercice: fromServices.CuentaPorPagarService,
    public snackBar: MatSnackBar
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
  update$ = this.actions$.pipe(
    ofType<analisisActions.UpdateAnalisis>(
      analisisActions.AnalisisActionTypes.UPDATE_ANALISIS
    ),
    map(action => action.payload),
    switchMap(analisis => {
      return this.analisisService
        .update(analisis)
        .pipe(
          map(res => new analisisActions.UpdateAnalisisSuccess(res)),
          catchError(error => of(new analisisActions.UpdateAnalisisFail(error)))
        );
    })
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<analisisActions.UpdateAnalisisSuccess>(
      analisisActions.AnalisisActionTypes.UPDATE_ANALISIS_SUCCESS
    ),
    map(action => action.payload),
    tap(analisis =>
      this.snackBar.open('Actualización exitosa', 'Cerrar', { duration: 1000 })
    ),
    map(analisis => new fromRoot.Go({ path: ['cxp/analisis', analisis.id] }))
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

  @Effect()
  loadComsProveedor$ = this.actions$.pipe(
    ofType<analisisActions.LoadFacturasPendientes>(
      analisisActions.AnalisisActionTypes.LOAD_COMS_PENDIENTES
    ),
    map(action => action.payload),
    switchMap(proveedor => {
      return this.analisisService
        .comsPendientes(proveedor.id)
        .pipe(
          map(coms => new analisisActions.LoadComsPendientesSuccess(coms)),
          catchError(error =>
            of(new analisisActions.LoadComsPendientesFail(error))
          )
        );
    })
  );
}
