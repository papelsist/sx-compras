import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { getGastos, getGastosFilter } from '../selectors';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromGastos from '../actions/gastos.actions';
import { GastosActionTypes } from '../actions/gastos.actions';

import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class GastosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.GastosService,
    private store: Store<fromStore.State>,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromGastos.LoadGastos>(GastosActionTypes.LoadGastos),
    switchMap(() => {
      return this.store.pipe(
        select(getGastosFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(
          requisiciones => new fromGastos.LoadGastosSuccess({ requisiciones })
        ),
        catchError(response => of(new fromGastos.LoadGastosFail({ response })))
      );
    })
  );

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromGastos.SetGastosFilter>(GastosActionTypes.SetGastosFilter),
    map(() => new fromGastos.LoadGastos())
  );

  @Effect()
  pagar$ = this.actions$.pipe(
    ofType<fromGastos.PagarGasto>(GastosActionTypes.PagarGasto),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.pagar(pago).pipe(
        tap(res => console.log('Success: ', res)),
        map(res => new fromGastos.PagarGastoSuccess({ requisicion: res })),
        catchError(response => of(new fromGastos.PagarGastoFail({ response })))
      );
    })
  );

  @Effect({ dispatch: false })
  pagoSuccess$ = this.actions$.pipe(
    ofType<fromGastos.PagarGastoSuccess>(GastosActionTypes.PagarGastoSuccess),
    map(action => action.payload.requisicion),
    tap(requisicion =>
      this.snackBar.open(
        `Requisición ${requisicion.folio} pagada exitosamente`,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
    // map(res => new fromRoot.Go({ path: ['/egresos/gastos', requisicion.id] }))
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromGastos.LoadGastosFail | fromGastos.PagarGastoFail>(
      GastosActionTypes.LoadGastosFail,
      GastosActionTypes.PagarGastoFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
