import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import * as fromActions from '../actions/pagos.actions';
import { PagoActionTypes } from '../actions/pagos.actions';
import { getPeriodoDePagos } from '../selectors/pagos.selectors';

import { PagosService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

import { MatSnackBar } from '@angular/material';
import { PagosPeriodoStoeKey } from '../reducers/pagos.reducer';

@Injectable()
export class PagosEffects {
  constructor(
    private actions$: Actions,
    private service: PagosService,
    private store: Store<fromStore.CxpState>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadPagos$ = this.actions$.pipe(
    ofType<fromActions.LoadPagos>(PagoActionTypes.LoadPagos),
    switchMap(() => {
      return this.store.pipe(
        select(getPeriodoDePagos),
        take(1)
      );
    }),
    switchMap(periodo =>
      this.service.list(periodo).pipe(
        map(res => new fromActions.LoadPagosSuccess(res)),
        catchError(error => of(new fromActions.LoadPagosFail(error)))
      )
    )
  );

  @Effect()
  setPeriodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodoDePagos>(PagoActionTypes.SetPeriodoDePagos),
    map(action => action.payload.periodo),
    tap(periodo => Periodo.saveOnStorage(PagosPeriodoStoeKey, periodo)),
    map(() => new fromActions.LoadPagos())
  );

  @Effect()
  updatePago$ = this.actions$.pipe(
    ofType<fromActions.UpdatePago>(PagoActionTypes.UpdatePago),
    map(action => action.payload),
    switchMap(pago => {
      return this.service.update(pago).pipe(
        map(res => new fromActions.UpdatePagoSuccess(res)),
        catchError(error => of(new fromActions.UpdatePagoFail(error)))
      );
    })
  );

  @Effect()
  deletePago$ = this.actions$.pipe(
    ofType<fromActions.DeletePago>(PagoActionTypes.DeletePago),
    map(action => action.payload),
    switchMap(pago => {
      return this.service.delete(pago.id).pipe(
        map(res => new fromActions.DeletePagoSuccess(pago)),
        catchError(error => of(new fromActions.LoadPagosFail(error)))
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(PagoActionTypes.DeletePagoSuccess),
    map(() => new fromRoot.Go({ path: ['cxp/pagos'] }))
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdatePagoSuccess>(PagoActionTypes.UpdatePagoSuccess),
    map(action => action.payload),
    tap(pago =>
      this.snackBar.open(`Pago ${pago.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(pago => new fromRoot.Go({ path: ['cxp/pagos', pago.id] }))
  );

  @Effect()
  aplicarPago$ = this.actions$.pipe(
    ofType<fromActions.AplicarPago>(PagoActionTypes.AplicarPago),
    map(action => action.payload),
    switchMap(pago => {
      return this.service.aplicar(pago).pipe(
        map(res => new fromActions.UpdatePagoSuccess(res)),
        catchError(error => of(new fromActions.UpdatePagoFail(error)))
      );
    })
  );
}
