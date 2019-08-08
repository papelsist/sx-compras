import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './reducer';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { ExistenciaActionTypes } from './actions';
import * as fromActions from './actions';

import { ExistenciaService } from '../services/existencia.service';

@Injectable()
export class ExistenciasEffects {
  constructor(
    private actions$: Actions,
    private service: ExistenciaService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(ExistenciaActionTypes.LoadExistencias),
    switchMap(() => {
      return this.service.list().pipe(
        map(
          existencias =>
            new fromActions.LoadExistenciasSuccess({
              existencias
            })
        ),
        catchError(response =>
          of(new fromActions.LoadExistenciasFail({ response }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateExistencia>(
      ExistenciaActionTypes.UpdateExistencia
    ),
    map(action => action.payload.update),
    switchMap(upd => {
      return this.service.update(upd).pipe(
        map(
          existencia =>
            new fromActions.UpdateExistenciaSuccess({
              existencia
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateExistenciaFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.LoadExistenciasFail | fromActions.UpdateExistenciaFail>(
      ExistenciaActionTypes.LoadExistenciasFail,
      ExistenciaActionTypes.UpdateExistenciaFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
