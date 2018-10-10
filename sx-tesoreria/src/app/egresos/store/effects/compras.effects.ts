import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromCompras from '../actions/compras.actions';
import { ComprasActionTypes } from '../actions/compras.actions';
import { getComprasFilter } from '../selectors';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { MatSnackBar } from '@angular/material';
import { ReportService } from '../../../reportes/services/report.service';

@Injectable()
export class ComprasEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ComprasService,
    private reportService: ReportService,
    private store: Store<fromStore.State>,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromCompras.LoadCompras>(ComprasActionTypes.LoadCompras),
    switchMap(() => {
      return this.store.pipe(
        select(getComprasFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(
          requisiciones => new fromCompras.LoadComprasSuccess({ requisiciones })
        ),
        catchError(response =>
          of(new fromCompras.LoadComprasFail({ response }))
        )
      );
    })
  );

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromCompras.SetComprasFilter>(ComprasActionTypes.SetComprasFilter),
    map(() => new fromCompras.LoadCompras())
  );

  @Effect()
  pagar$ = this.actions$.pipe(
    ofType<fromCompras.PagarCompra>(ComprasActionTypes.PagarCompra),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.pagar(pago).pipe(
        map(res => new fromCompras.PagarCompraSuccess({ requisicion: res })),
        catchError(response =>
          of(new fromCompras.PagarCompraFail({ response }))
        )
      );
    })
  );

  @Effect()
  pagoSuccess$ = this.actions$.pipe(
    ofType<fromCompras.PagarCompraSuccess>(
      ComprasActionTypes.PagarCompraSuccess
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
  errorHandler$ = this.actions$.pipe(
    ofType<fromCompras.LoadComprasFail | fromCompras.PagarCompraFail>(
      ComprasActionTypes.LoadComprasFail,
      ComprasActionTypes.PagarCompraFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
