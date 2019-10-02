import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { AnalisisTrsDetActionTypes } from '../actions/analisis-de-transformacion-det.actions';
import * as fromActions from '../actions/analisis-de-transformacion-det.actions';

import { AnalisisDeTrsDetService } from 'app/cxp/services/analisis-de-trs-det.service';

@Injectable()
export class AnalisisTrsDetEffects {
  constructor(
    private actions$: Actions,
    private service: AnalisisDeTrsDetService
  ) {}

  @Effect()
  loadAnalisis$ = this.actions$.pipe(
    ofType<fromActions.LoadAnalisisTrsDet>(
      AnalisisTrsDetActionTypes.LoadAnalisisTrsDet
    ),
    map(action => action.payload.analisisId),
    switchMap(notaId => {
      return this.service.list(notaId).pipe(
        map(
          partidas =>
            new fromActions.LoadAnalisisTrsDetSuccess({
              partidas
            })
        ),
        catchError(response =>
          of(new fromActions.LoadAnalisisTrsDetFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.AddAnalisisTrsDet>(
      AnalisisTrsDetActionTypes.AddAnalisisTrsDet
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.save(payload.analisisId, payload.det).pipe(
        map(
          det =>
            new fromActions.AddAnalisisTrsDetSuccess({
              det
            })
        ),
        catchError(response =>
          of(new fromActions.AddAnalisisTrsDetFail({ response }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateAnalisisTrsDet>(
      AnalisisTrsDetActionTypes.UpdateAnalisisTrsDet
    ),
    map(action => action.payload),
    switchMap(upd => {
      return this.service.update(upd.analisisId, upd.det).pipe(
        map(
          det =>
            new fromActions.UpdateAnalisisTrsDetSuccess({
              det
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateAnalisisTrsDetFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.RemoveAnalisisTrsDet>(
      AnalisisTrsDetActionTypes.RemoveAnalisisTrsDet
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.delete(payload.analisisId, payload.id).pipe(
        map(
          () =>
            new fromActions.RemoveAnalisisTrsDetSuccess({
              id: payload.id
            })
        ),
        catchError(response =>
          of(new fromActions.RemoveAnalisisTrsDetFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadAnalisisTrsDetFail
      | fromActions.AddAnalisisTrsDetFail
      | fromActions.RemoveAnalisisTrsDetFail
      | fromActions.UpdateAnalisisTrsDetFail
    >(
      AnalisisTrsDetActionTypes.LoadAnalisisTrsDetFail,
      AnalisisTrsDetActionTypes.AddAnalisisTrsDetFail,
      AnalisisTrsDetActionTypes.UpdateAnalisisTrsDetFail,
      AnalisisTrsDetActionTypes.RemoveAnalisisTrsDetFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
