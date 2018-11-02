import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { FichaActionTypes } from '../actions/ficha.actions';
import * as fromActions from '../actions/ficha.actions';
import { getFichasFilter } from '../../store/selectors';

import { FichasService } from '../../services/ficha.service';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class FichaEffects {
  constructor(
    private actions$: Actions,
    private service: FichasService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetFichasFilter>(FichaActionTypes.SetFichasFilter),
    map(action => new fromActions.LoadFichas())
  );

  @Effect()
  loadFichas$ = this.actions$.pipe(
    ofType(FichaActionTypes.LoadFichas),
    switchMap(() => {
      return this.store.pipe(
        select(getFichasFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(fichas => new fromActions.LoadFichasSuccess({ fichas })),
        catchError(error => of(new fromActions.FichaError({ response: error })))
      )
    )
  );

  @Effect()
  createFicha$ = this.actions$.pipe(
    ofType<fromActions.GenerateFichas>(FichaActionTypes.GenerateFichas),
    map(action => action.payload.command),
    switchMap(command => {
      return this.service.generar(command).pipe(
        map(res => new fromActions.GenerateFichasSuccess({ fichas: res })),
        catchError(error => of(new fromActions.FichaError({ response: error })))
      );
    })
  );

  @Effect()
  delteFicha$ = this.actions$.pipe(
    ofType<fromActions.DeleteFicha>(FichaActionTypes.DeleteFicha),
    map(action => action.payload.ficha),
    switchMap(ficha => {
      return this.service.delete(ficha).pipe(
        map(res => new fromActions.DeleteFichaSuccess({ ficha: ficha })),
        catchError(error => of(new fromActions.FichaError({ response: error })))
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<fromActions.GenerateFichasSuccess>(
      FichaActionTypes.GenerateFichasSuccess
    ),
    map(action => action.payload.fichas),
    tap(fichas =>
      this.snackBar.open(
        `${fichas.length} fichas generadas exitosamente`,
        'Cerrar',
        {
          duration: 7000
        }
      )
    )
  );

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteFichaSuccess>(FichaActionTypes.DeleteFichaSuccess),
    map(action => action.payload.ficha),
    tap(fichas =>
      this.snackBar.open(`${fichas.folio} eliminada exitosamente`, 'Cerrar', {
        duration: 7000
      })
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.FichaError>(FichaActionTypes.FichaError),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
