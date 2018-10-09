import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ChequeActionTypes } from '../actions/cheque.actions';
import * as fromActions from '../actions/cheque.actions';
import { getChequesFilter } from '../../store/selectors';

import { ChequesService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class ChequesEffects {
  constructor(
    private actions$: Actions,
    private service: ChequesService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetChequesFilter>(ChequeActionTypes.SetChequesFilter),
    map(action => new fromActions.LoadCheques())
  );

  @Effect()
  loadCheques$ = this.actions$.pipe(
    ofType(ChequeActionTypes.LoadCheques),
    switchMap(() => {
      return this.store.pipe(
        select(getChequesFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(cheques => new fromActions.LoadChequesSuccess({ cheques })),
        catchError(error => of(new fromActions.LoadChequesFail(error)))
      )
    )
  );

  @Effect()
  updateCheque$ = this.actions$.pipe(
    ofType<fromActions.UpdateCheque>(ChequeActionTypes.UpdateCheque),
    map(action => action.payload.cheque),
    switchMap(cheque => {
      return this.service
        .update({ id: cheque.id, changes: cheque.changes })
        .pipe(
          map(res => new fromActions.UpdateChequeSuccess({ cheque: res })),
          catchError(error => of(new fromActions.UpdateChequeFail(error)))
        );
    })
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateChequeSuccess>(
      ChequeActionTypes.UpdateChequeSuccess
    ),
    map(action => action.payload.cheque),
    tap(cheque =>
      this.snackBar.open(`Cheque ${cheque.folio} actualizado `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(cheque => new fromRoot.Go({ path: ['cxp/cheques'] }))
  );
}
