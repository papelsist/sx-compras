import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store/reducers';
import * as fromSelectors from '../../store/selectors';

import * as analisisActions from '../actions/analisis.actions';
import { AnalisisActionTypes } from '../actions/analisis.actions';

import * as fromServices from '../../services';

import { MatSnackBar } from '@angular/material';
import { Periodo } from '../../../_core/models/periodo';

@Injectable()
export class AnalisisEffects {
  constructor(
    private actions$: Actions,
    private analisisService: fromServices.AnalisisService,
    private cuentaPorPagarSercice: fromServices.CuentaPorPagarService,
    public snackBar: MatSnackBar,
    public store: Store<fromStore.CxpState>
  ) {}

  /*
  @Effect()
  load$ = this.actions$.pipe(
    ofType<analisisActions.Load>(AnalisisActionTypes.LOAD),
    switchMap(() => {
      return this.analisisService
        .list({})
        .pipe(
          map(res => new analisisActions.LoadSuccess(res)),
          catchError(error => of(new analisisActions.LoadFail(error)))
        );
    })
  );
  */
  @Effect()
  load$ = this.actions$.pipe(
    ofType<analisisActions.Load>(AnalisisActionTypes.LOAD),
    switchMap(() => {
      return this.store.pipe(select(fromSelectors.getAnalisisPeriodo), take(1));
    }),
    switchMap(periodo => {
      return this.analisisService
        .list({ periodo: periodo })
        .pipe(
          map(res => new analisisActions.LoadSuccess(res)),
          catchError(error => of(new analisisActions.LoadFail(error)))
        );
    })
  );

  @Effect()
  periodo$ = this.actions$.pipe(
    ofType<analisisActions.SetAnalisisPeriodo>(
      AnalisisActionTypes.SET_ANALSIS_PERIODO
    ),
    map(action => action.payload),
    tap(periodo =>
      Periodo.saveOnStorage('sx-compras.analisis.periodo', periodo)
    ),
    map(() => new analisisActions.Load())
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
  saveSuccess$ = this.actions$.pipe(
    ofType<analisisActions.SaveAnalisisSuccess>(
      analisisActions.AnalisisActionTypes.SAVE_ANALISIS_SUCCESS
    ),
    map(action => action.payload),
    map(analisis => new fromRoot.Go({ path: ['cxp/analisis', analisis.id] }))
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
      analisisActions.AnalisisActionTypes.UPDATE_ANALISIS_SUCCESS,
      analisisActions.AnalisisActionTypes.CERRAR_ANALISIS_SUCCESS
    ),
    map(action => action.payload),
    tap(analisis =>
      this.snackBar.open(`Análisis ${analisis.folio} actualizado `, 'Cerrar', {
        duration: 2000
      })
    ),
    map(analisis => new fromRoot.Go({ path: ['cxp/analisis', analisis.id] }))
  );

  @Effect()
  cerrar$ = this.actions$.pipe(
    ofType<analisisActions.CerrarAnalisis>(
      analisisActions.AnalisisActionTypes.CERRAR_ANALISIS
    ),
    map(action => action.payload),
    switchMap(analisis => {
      return this.analisisService
        .cerrar(analisis)
        .pipe(
          map(res => new analisisActions.CerrarAnalisisSuccess(res)),
          catchError(error => of(new analisisActions.CerrarAnalisisFail(error)))
        );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<analisisActions.DeleteAnalisis>(
      analisisActions.AnalisisActionTypes.DELETE_ANALISIS
    ),
    map(action => action.payload),
    switchMap(analisis => {
      return this.analisisService
        .delete(analisis.id)
        .pipe(
          map(res => new analisisActions.DeleteAnalisisSuccess(analisis)),
          catchError(error => of(new analisisActions.DeleteAnalisisFail(error)))
        );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(analisisActions.AnalisisActionTypes.DELETE_ANALISIS_SUCCESS),
    map(() => new fromRoot.Go({ path: ['cxp/analisis'] }))
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

  @Effect({ dispatch: false })
  errorHandler$ = this.actions$.pipe(
    ofType(
      AnalisisActionTypes.UPDATE_ANALISIS_FAIL,
      AnalisisActionTypes.SAVE_ANALISIS_FAIL
    ),
    map((action: any) => {
      const error = action.payload;
      this.snackBar.open(
        `Error: ${error.status}: ${error.statusText}`,
        'Cerrar',
        {
          duration: 7000
        }
      );
    })
  );
}
