import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './reducer';
import { selectPeriodo } from './selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { ReciboActionTypes } from './actions';
import * as fromActions from './actions';

import { ReciboService } from '../services/recibo.service';

@Injectable()
export class RecibosEffects {
  constructor(
    private actions$: Actions,
    private service: ReciboService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(ReciboActionTypes.LoadRecibos),
    switchMap(() => {
      return this.store.pipe(
        select(selectPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(
          recibos =>
            new fromActions.LoadRecibosSuccess({
              recibos
            })
        ),
        catchError(response =>
          of(new fromActions.LoadRecibosFail({ response }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateRecibo>(ReciboActionTypes.UpdateRecibo),
    map(action => action.payload.update),
    switchMap(upd => {
      return this.service.update(upd).pipe(
        map(
          recibo =>
            new fromActions.UpdateReciboSuccess({
              recibo
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateReciboFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteRecibo>(ReciboActionTypes.DeleteRecibo),
    map(action => action.payload.recibo),
    switchMap(recibo => {
      return this.service.delete(recibo.id).pipe(
        map(
          () =>
            new fromActions.DeleteReciboSuccess({
              recibo
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteReciboFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteReciboSuccess>(
      ReciboActionTypes.DeleteReciboSuccess
    ),
    map(action => action.payload.recibo),
    map(r => new fromRoot.Go({ path: ['cxp/recibos'] }))
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.LoadRecibosFail | fromActions.DeleteReciboFail>(
      ReciboActionTypes.LoadRecibosFail,
      ReciboActionTypes.DeleteReciboFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
