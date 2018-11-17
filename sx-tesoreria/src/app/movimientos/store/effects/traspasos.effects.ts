import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { TraspasoActionTypes } from '../actions/traspaso.actions';
import * as fromActions from '../actions/traspaso.actions';
import { getTraspasosFilter } from '../../store/selectors/traspaso.selectors';

import { TraspasoService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class TraspasosEffects {
  constructor(
    private actions$: Actions,
    private service: TraspasoService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetTraspasosFilter>(
      TraspasoActionTypes.SetTraspasosFilter
    ),
    map(action => new fromActions.LoadTraspasos())
  );

  @Effect()
  loadTraspasos$ = this.actions$.pipe(
    ofType(TraspasoActionTypes.LoadTraspasos),
    switchMap(() => {
      return this.store.pipe(
        select(getTraspasosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        tap(traspasos => console.log('Traspasos: ', traspasos)),
        map(traspasos => new fromActions.LoadTraspasosSuccess({ traspasos })),
        catchError(error =>
          of(new fromActions.TraspasoError({ response: error }))
        )
      )
    )
  );

  @Effect()
  createCheque$ = this.actions$.pipe(
    ofType<fromActions.CreateTraspaso>(TraspasoActionTypes.CreateTraspaso),
    map(action => action.payload.traspaso),
    switchMap(traspaso => {
      return this.service.save(traspaso).pipe(
        map(res => new fromActions.CreateTraspasoSuccess({ traspaso: res })),
        catchError(error =>
          of(new fromActions.TraspasoError({ response: error }))
        )
      );
    })
  );

  @Effect()
  deletePago$ = this.actions$.pipe(
    ofType<fromActions.DeleteTraspaso>(TraspasoActionTypes.DeleteTraspaso),
    map(action => action.payload.traspaso),
    switchMap(traspaso => {
      return this.service.delete(traspaso).pipe(
        map(res => new fromActions.DeleteTraspasoSuccess({ traspaso })),
        catchError(error =>
          of(new fromActions.TraspasoError({ response: error }))
        )
      );
    })
  );

  @Effect()
  updatePago$ = this.actions$.pipe(
    ofType<fromActions.UpdateTraspaso>(TraspasoActionTypes.UpdateTraspaso),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(traspaso => new fromActions.UpdateTraspasoSuccess({ traspaso })),
        catchError(error =>
          of(new fromActions.TraspasoError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<
      fromActions.CreateTraspasoSuccess | fromActions.UpdateTraspasoSuccess
    >(
      TraspasoActionTypes.CreateTraspasoSuccess,
      TraspasoActionTypes.UpdateTraspasoSuccess
    ),
    map(action => action.payload.traspaso),
    tap(rembolso =>
      this.snackBar.open(
        `Traspaso ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.TraspasoError>(TraspasoActionTypes.TraspasoError),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
