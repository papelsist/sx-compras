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
        map(res => new fromGastos.PagarGastoSuccess({ requisicion: res })),
        catchError(error => of(new fromGastos.PagarGastoFail(error)))
      );
    })
  );

  @Effect()
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
    ),
    map(res => new fromRoot.Go({ path: ['cxp/requisiciones', res.id] }))
  );

  @Effect({ dispatch: false })
  errorHandler$ = this.actions$.pipe(
    ofType(GastosActionTypes.LoadGastosFail, GastosActionTypes.PagarGastoFail),
    map((action: any) => {
      const error = action.payload;
      this.snackBar.open(
        `Error: ${error.status}: ${error.statusText}`,
        'Cerrar',
        {
          duration: 8000
        }
      );
    })
  );
}
