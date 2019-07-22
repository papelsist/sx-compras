import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getPeriodoDeNotas } from '../selectors/notas.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { NotaActionTypes, NotaActions } from '../actions/notas.actions';
import * as fromActions from '../actions/notas.actions';
import { NotasService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

import { MatSnackBar } from '@angular/material';
import { NotasPeriodoStoeKey } from '../reducers/notas.reducers';

@Injectable()
export class NotasEffects {
  constructor(
    private actions$: Actions,
    private service: NotasService,
    private store: Store<fromStore.CxpState>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadNotas$ = this.actions$.pipe(
    ofType(NotaActionTypes.LoadNotas),
    switchMap(() => {
      return this.store.pipe(select(getPeriodoDeNotas), take(1));
    }),
    switchMap(periodo => {
      return this.service
        .list(periodo)
        .pipe(
          map(res => new fromActions.LoadNotasSuccess(res)),
          catchError(error => of(new fromActions.LoadNotasFail(error)))
        );
    })
  );

  @Effect()
  setPeriodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodoDeNotas>(NotaActionTypes.SetPeriodoDeNotas),
    map(action => action.payload.periodo),
    tap(periodo =>
      Periodo.saveOnStorage(NotasPeriodoStoeKey, periodo)
    ),
    map(() => new fromActions.LoadNotas())
  );

  @Effect()
  addNota$ = this.actions$.pipe(
    ofType<fromActions.AddNota>(NotaActionTypes.AddNota),
    map(action => action.payload),
    switchMap(nota => {
      return this.service
        .save(nota)
        .pipe(
          map(res => new fromActions.AddNotaSuccess(res)),
          catchError(error => of(new fromActions.AddNotaFail(error)))
        );
    })
  );

  @Effect()
  addNotaSuccess$ = this.actions$.pipe(
    ofType(NotaActionTypes.AddNotaSuccess, NotaActionTypes.UpdateNotaSuccess),
    map((action: any) => action.payload),
    map(nota => new fromRoot.Go({ path: ['cxp/notas', nota.id] }))
  );

  @Effect()
  updateNota$ = this.actions$.pipe(
    ofType<fromActions.UpdateNota>(NotaActionTypes.UpdateNota),
    map(action => action.payload),
    switchMap(nota => {
      return this.service
        .update(nota)
        .pipe(
          map(res => new fromActions.UpdateNotaSuccess(res)),
          catchError(error => of(new fromActions.UpdateNotaFail(error)))
        );
    })
  );

  @Effect()
  deleteNota$ = this.actions$.pipe(
    ofType<fromActions.DeleteNota>(NotaActionTypes.DeleteNota),
    map(action => action.payload),
    switchMap(nota => {
      return this.service
        .delete(nota.id)
        .pipe(
          map(res => new fromActions.DeleteNotaSuccess(nota)),
          catchError(error => of(new fromActions.LoadNotasFail(error)))
        );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(NotaActionTypes.DeleteNotaSuccess),
    map(() => new fromRoot.Go({ path: ['cxp/notas'] }))
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateNotaSuccess>(NotaActionTypes.UpdateNotaSuccess),
    map(action => action.payload),
    tap(nota =>
      this.snackBar.open(`Nota ${nota.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    )
    // map(nota => new fromRoot.Go({ path: ['cxp/notas', nota.id] }))
  );

  @Effect()
  aplicarNota$ = this.actions$.pipe(
    ofType<fromActions.AplicarNota>(NotaActionTypes.AplicarNota),
    map(action => action.payload),
    switchMap(nota => {
      return this.service
        .aplicar(nota)
        .pipe(
          map(res => new fromActions.UpdateNotaSuccess(res)),
          catchError(error => of(new fromActions.UpdateNotaFail(error)))
        );
    })
  );

  // Fail effects
  @Effect({ dispatch: false })
  updateFail$ = this.actions$.pipe(
    ofType<fromActions.UpdateNotaFail>(NotaActionTypes.UpdateNotaFail),
    map(action => action.payload),
    tap(response => {
      console.error('UpdateNota error: ', response.error);
      const msg =
        response.status === 500
          ? 'Error en el servidor (500)'
          : response.status;
      this.snackBar.open(`${msg} `, 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top',
        politeness: 'assertive'
      });
    }),
    map(nota => new fromRoot.Go({ path: ['cxp/notas', nota.id] }))
  );

  /*
  @Effect({ dispatch: false })
  setSearchterm$ = this.actions$.pipe(
    ofType<fromActions.SetSearchTerm>(NotaActionTypes.SetSearchTerm),
    map(action => action.payload),
    tap(term => localStorage.setItem('sx-notas.notas.searchTerm', term))
  );
  */
}
