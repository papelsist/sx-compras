import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { AnalisisDeNotaActionTypes } from '../actions/analisis-de-nota.actions';
import * as fromActions from '../actions/analisis-de-nota.actions';

import { AnalisisDeNotaService } from 'app/cxp/services/analisis-de-nota.service';

@Injectable()
export class AnalisisDeNotaEffects {
  constructor(
    private actions$: Actions,
    private service: AnalisisDeNotaService
  ) {}

  @Effect()
  loadAnalisis$ = this.actions$.pipe(
    ofType<fromActions.LoadAnalisisDeNota>(
      AnalisisDeNotaActionTypes.LoadAnalisisDeNota
    ),
    map(action => action.payload.notaId),
    switchMap(notaId => {
      return this.service.list(notaId).pipe(
        map(
          analisis =>
            new fromActions.LoadAnalisisDeNotaSuccess({
              analisis
            })
        ),
        catchError(response =>
          of(new fromActions.LoadAnalisisDeNotaFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateAnalisisDeNota>(
      AnalisisDeNotaActionTypes.CreateAnalisisDeNota
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.save(payload.notaId, payload.analisis).pipe(
        map(
          analisis =>
            new fromActions.CreateAnalisisDeNotaSuccess({
              analisis
            })
        ),
        catchError(response =>
          of(new fromActions.CreateAnalisisDeNotaFail({ response }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateAnalisisDeNota>(
      AnalisisDeNotaActionTypes.UpdateAnalisisDeNota
    ),
    map(action => action.payload),
    switchMap(upd => {
      return this.service.update(upd.notaId, upd.analisis).pipe(
        map(
          analisis =>
            new fromActions.UpdateAnalisisDeNotaSuccess({
              analisis
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateAnalisisDeNotaFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteAnalisisDeNota>(
      AnalisisDeNotaActionTypes.DeleteAnalisisDeNota
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.delete(payload.notaId, payload.analisisId).pipe(
        map(
          () =>
            new fromActions.DeleteAnalisisDeNotaSuccess({
              analisisId: payload.analisisId
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteAnalisisDeNotaFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadAnalisisDeNotaFail
      | fromActions.CreateAnalisisDeNotaFail
      | fromActions.DeleteAnalisisDeNotaFail
      | fromActions.UpdateAnalisisDeNotaFail
    >(
      AnalisisDeNotaActionTypes.LoadAnalisisDeNotaFail,
      AnalisisDeNotaActionTypes.CreateAnalisisDeNotaFail,
      AnalisisDeNotaActionTypes.UpdateAnalisisDeNotaFail,
      AnalisisDeNotaActionTypes.DeleteAnalisisDeNotaFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
