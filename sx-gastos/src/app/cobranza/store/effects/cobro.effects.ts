import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { CobroActionTypes } from '../actions/cobro.actions';
import * as fromActions from '../actions/cobro.actions';

import { CobroService } from '../../services/cobro.service';

@Injectable()
export class CobroEffects {
  constructor(private actions$: Actions, private service: CobroService) {}

  @Effect()
  loadCobros$ = this.actions$.pipe(
    ofType<fromActions.LoadCobros>(CobroActionTypes.LoadCobros),
    map(action => action.payload),
    switchMap(payload =>
      this.service.list(payload.cartera.clave, payload.filter).pipe(
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
