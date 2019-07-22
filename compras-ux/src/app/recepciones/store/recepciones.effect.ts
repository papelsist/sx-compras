import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './recepciones.reducer';
import * as fromRecepciones from './recepciones.selectors';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  catchError,
  take,
  delay,
  mergeMap
} from 'rxjs/operators';

import * as fromActions from './recepciones.actions';
import { RecepcionesService } from '../services';

import { TdDialogService } from '@covalent/core';

@Injectable()
export class RecepcionesEffects {
  constructor(
    private actions$: Actions,
    private service: RecepcionesService,
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  @Effect()
  loadComs$ = this.actions$.pipe(
    ofType(fromActions.RecepcionActionTypes.LoadRecepciones),
    switchMap(() => {
      return this.store.pipe(
        select(fromRecepciones.getRecepcionesFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(
          recepciones => new fromActions.LoadRecepcionesSuccess({ recepciones })
        ),
        catchError(response =>
          of(new fromActions.LoadRecepcionesFail({ response }))
        )
      );
    })
  );

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetRecepcionesFilter>(
      fromActions.RecepcionActionTypes.SetRecepcionesFilter
    ),
    map(() => new fromActions.LoadRecepciones())
  );

  @Effect()
  error$ = this.actions$.pipe(
    ofType<fromActions.LoadRecepcionesFail>(
      fromActions.RecepcionActionTypes.LoadRecepcionesFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
