import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './cobro.reducer';

import { of, from } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CobroActionTypes } from './cobro.actions';
import * as fromActions from './cobro.actions';

import { CobroService } from '../services/cobro.service';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CobroEffects {
  constructor(
    private actions$: Actions,
    private service: CobroService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetCobrosFilter>(CobroActionTypes.SetCobrosFilter),
    map(action => new fromActions.LoadCobros())
  );

  @Effect()
  loadCobros$ = this.actions$.pipe(
    ofType(CobroActionTypes.LoadCobros),
    switchMap(() => {
      return this.store.pipe(
        select(fromStore.getCobrosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(cobros => new fromActions.LoadCobrosSuccess({ cobros })),
        catchError(error =>
          of(new fromActions.LoadCobrosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.LoadCobrosFail>(CobroActionTypes.LoadCobrosFail),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
