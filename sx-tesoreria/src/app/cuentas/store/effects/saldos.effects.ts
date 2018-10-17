import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';
import { SaldoActionTypes } from '../actions/saldos.actions';
import * as fromActions from '../actions/saldos.actions';

import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { CuentasService } from '../../services';

@Injectable()
export class SaldosEffects {
  constructor(private actions$: Actions, private service: CuentasService) {}

  @Effect()
  loadSaldos$ = this.actions$.pipe(
    ofType<fromActions.LoadSaldos>(SaldoActionTypes.LoadSaldos),
    map(action => action.payload.cuenta),
    switchMap(cuenta =>
      this.service.loadSaldos(cuenta).pipe(
        tap(saldos => console.log('Saldos obtenidos: ', saldos)),
        map(saldos => new fromActions.LoadSaldosSuccess({ saldos })),
        catchError(response => of(new fromActions.LoadSaldosFail({ response })))
      )
    )
  );

  @Effect()
  loadFail$ = this.actions$.pipe(
    ofType<fromActions.LoadSaldosFail>(SaldoActionTypes.LoadSaldosFail),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
