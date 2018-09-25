import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { PagoActionTypes } from '../actions/pagos.actions';
import * as fromActions from '../actions/pagos.actions';
import { PagosService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class PagosEffects {
  constructor(
    private actions$: Actions,
    private service: PagosService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadPagos$ = this.actions$.pipe(
    ofType(PagoActionTypes.LoadPagos),
    switchMap(() =>
      this.service.list().pipe(
        map(res => new fromActions.LoadPagosSuccess(res)),
        catchError(error => of(new fromActions.LoadPagosFail(error)))
      )
    )
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
