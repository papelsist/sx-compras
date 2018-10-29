import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CobroActionTypes } from '../actions/cobros.actions';
import * as fromActions from '../actions/cobros.actions';
import { getCobrosFilter } from '../../store/selectors';

import { CobroService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CobrosEffects {
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
        select(getCobrosFilter),
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
  updateCobro$ = this.actions$.pipe(
    ofType<fromActions.UpdateCobro>(CobroActionTypes.UpdateCobro),
    map(action => action.payload.cobro),
    switchMap(cobro => {
      return this.service.update({ id: cobro.id, changes: cobro.changes }).pipe(
        map(res => new fromActions.UpdateCobroSuccess({ cobro: res })),
        catchError(error =>
          of(new fromActions.UpdateCobroFail({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateCobroSuccess>(CobroActionTypes.UpdateCobroSuccess),
    map(action => action.payload.cobro),
    tap(cobro =>
      this.snackBar.open(`Cobro actualizado `, 'Cerrar', {
        duration: 5000
      })
    )
    // map(cheque => new fromRoot.Go({ path: ['cxp/cobros'] }))
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.LoadCobrosFail | fromActions.UpdateCobroFail>(
      CobroActionTypes.LoadCobrosFail,
      CobroActionTypes.UpdateCobroFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
