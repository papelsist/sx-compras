import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { RembolsoActionTypes } from '../actions/rembolso.actions';
import * as fromActions from '../actions/rembolso.actions';
import { getRembolsosFilter } from '../../store/selectors/rembolso.selectors';

import { RembolsoService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class RembolsosEffects {
  constructor(
    private actions$: Actions,
    private service: RembolsoService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetRembolsosFilter>(
      RembolsoActionTypes.SetRembolsosFilter
    ),
    map(action => new fromActions.LoadRembolsos())
  );

  @Effect()
  loadRembolsos$ = this.actions$.pipe(
    ofType(RembolsoActionTypes.LoadRembolsos),
    switchMap(() => {
      return this.store.pipe(
        select(getRembolsosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(rembolsos => new fromActions.LoadRembolsosSuccess({ rembolsos })),
        catchError(error =>
          of(new fromActions.LoadRembolsosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  saveRembolso$ = this.actions$.pipe(
    ofType<fromActions.SaveRembolso>(RembolsoActionTypes.SaveRembolso),
    map(action => action.payload.rembolso),
    switchMap(rembolso => {
      return this.service.save(rembolso).pipe(
        map(res => new fromActions.SaveRembolsoSuccess({ rembolso: res })),
        catchError(error =>
          of(new fromActions.SaveRembolsoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  updateRembolso$ = this.actions$.pipe(
    ofType<fromActions.UpdateRembolso>(RembolsoActionTypes.UpdateRembolso),
    map(action => action.payload.rembolso),
    switchMap(rembolso => {
      return this.service
        .update({ id: rembolso.id, changes: rembolso.changes })
        .pipe(
          map(res => new fromActions.UpdateRembolsoSuccess({ rembolso: res })),
          catchError(error =>
            of(new fromActions.UpdateRembolsoFail({ response: error }))
          )
        );
    })
  );

  @Effect()
  deleteRembolso$ = this.actions$.pipe(
    ofType<fromActions.DeleteRembolso>(RembolsoActionTypes.DeleteRembolso),
    map(action => action.payload.rembolso),
    switchMap(rembolso => {
      return this.service.delete(rembolso.id).pipe(
        map(() => new fromActions.DeleteRembolsoSuccess({ rembolso })),
        catchError(error =>
          of(new fromActions.DeleteRembolsoFail({ response: error }))
        )
      );
    })
  );

  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteRembolsoSuccess>(
      RembolsoActionTypes.DeleteRembolsoSuccess
    ),
    map(() => new fromRoot.Go({ path: ['cxp/rembolsos'] }))
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateRembolsoSuccess | fromActions.SaveRembolsoSuccess>(
      RembolsoActionTypes.UpdateRembolsoSuccess,
      RembolsoActionTypes.SaveRembolsoSuccess
    ),
    map(action => action.payload.rembolso),
    tap(rembolso =>
      this.snackBar.open(`Rembolso ${rembolso.id} actualizado `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(res => new fromRoot.Go({ path: ['cxp/rembolsos', res.id] }))
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadRembolsosFail
      | fromActions.SaveRembolsoFail
      | fromActions.UpdateRembolsoFail
      | fromActions.DeleteRembolsoFail
    >(
      RembolsoActionTypes.LoadRembolsosFail,
      RembolsoActionTypes.SaveRembolsoFail,
      RembolsoActionTypes.UpdateRembolsoFail,
      RembolsoActionTypes.DeleteRembolsoFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
