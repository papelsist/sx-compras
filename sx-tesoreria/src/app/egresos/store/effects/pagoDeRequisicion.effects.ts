import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../actions/pagoDeRequisicion.actions';
import * as fromCompras from '../actions/compras.actions';
import * as fromGastos from '../actions/gastos.actions';

import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  map,
  switchMap,
  catchError,
  tap,
  take,
  mergeMap
} from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromServices from '../../services';

import { MatSnackBar } from '@angular/material';
import { ReportService } from '../../../reportes/services/report.service';

@Injectable()
export class PagoDeRequisicionEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.PagoDeRequisicionService,
    private reportService: ReportService,
    private store: Store<fromStore.State>,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  pagar$ = this.actions$.pipe(
    ofType<fromActions.PagoRequisicion>(
      fromActions.PagoRequisicionActionTypes.PagoRequisicion
    ),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.pagar(pago).pipe(
        map(
          res => new fromActions.PagoRequisicionSuccess({ requisicion: res })
        ),
        catchError(response =>
          of(new fromActions.PagoRequisicionFail({ response }))
        )
      );
    })
  );

  @Effect()
  pagoSuccess$ = this.actions$.pipe(
    ofType<fromActions.PagoRequisicionSuccess>(
      fromActions.PagoRequisicionActionTypes.PagoRequisicionSuccess
    ),
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
    map(res => new fromRoot.Go({ path: ['/egresos/compras'] }))
  );

  @Effect()
  generarCheque$ = this.actions$.pipe(
    ofType<fromActions.GenerarCheque>(
      fromActions.PagoRequisicionActionTypes.GenerarCheque
    ),
    mergeMap(action => {
      return this.service.generarCheque(action.payload.requisicion).pipe(
        map(requisicion => {
          const tipo = requisicion.tipo;
          if (tipo === 'COMPRAS') {
            return new fromCompras.UpsertCompra({ requisicion });
          } else {
            return new fromGastos.UpsertGasto({ requisicion });
          }
        }),
        catchError(response => of(new fromRoot.GlobalHttpError({ response })))
      );
    })
  );

  @Effect()
  cancelarCheque$ = this.actions$.pipe(
    ofType<fromActions.CancelarCheque>(
      fromActions.PagoRequisicionActionTypes.CancelarCheque
    ),
    map(action => action.payload.cancelacion),
    switchMap(cancelacion => {
      return this.service.cancelarCheque(cancelacion).pipe(
        map(requisicion => {
          const tipo = requisicion.tipo;
          if (tipo === 'COMPRAS') {
            return new fromCompras.UpsertCompra({ requisicion });
          } else {
            return new fromGastos.UpsertGasto({ requisicion });
          }
        }),
        catchError(response => of(new fromRoot.GlobalHttpError({ response })))
      );
    })
  );

  @Effect()
  cancelarPago$ = this.actions$.pipe(
    ofType<fromActions.CancelarPagoRequisicion>(
      fromActions.PagoRequisicionActionTypes.CancelarPagoRequisicion
    ),
    switchMap(action => {
      return this.service.cancelarPago(action.payload.requisicion).pipe(
        map(requisicion => {
          console.log('Requisicon con pago cancelado: ', requisicion);
          const tipo = requisicion.tipo;
          if (tipo === 'COMPRAS') {
            return new fromCompras.UpsertCompra({ requisicion });
          } else {
            return new fromGastos.UpsertGasto({ requisicion });
          }
        }),
        catchError(response => of(new fromRoot.GlobalHttpError({ response })))
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.PagoRequisicionFail | fromActions.CancelarChequeFail>(
      fromActions.PagoRequisicionActionTypes.PagoRequisicionFail,
      fromActions.PagoRequisicionActionTypes.CancelarChequeFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
