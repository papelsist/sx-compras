import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getFacturasFilter } from '../selectors/facturas.selector';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { FacturaActionTypes } from '../actions/facturas.actions';
import * as fromActions from '../actions/facturas.actions';

import { CuentaPorPagarService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class FacturasEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private service: CuentaPorPagarService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadFacturas$ = this.actions$.pipe(
    ofType<fromActions.LoadFacturas>(FacturaActionTypes.LoadFacturas),
    switchMap(() => {
      return this.store.pipe(
        select(getFacturasFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(res => new fromActions.LoadFacturasSuccess(res)),
        catchError(error => of(new fromActions.LoadFacturasFail(error)))
      );
    })
  );

  @Effect()
  filterChange$ = this.actions$.pipe(
    ofType<fromActions.SetFacturasFilter>(FacturaActionTypes.SetFacturasFilter),
    map(action => new fromActions.LoadFacturas())
  );

  @Effect()
  updateFactura$ = this.actions$.pipe(
    ofType<fromActions.UpdateFactura>(FacturaActionTypes.UpdateFactura),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(res => new fromActions.UpdateFacturaSuccess(res)),
        catchError(error => of(new fromActions.UpdateFacturaFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateFacturaSuccess>(
      FacturaActionTypes.UpdateFacturaSuccess
    ),
    map(action => action.payload),
    tap(factura =>
      this.snackBar.open(`Factura ${factura.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    )
  );

  @Effect()
  saldarFactura$ = this.actions$.pipe(
    ofType<fromActions.SaldarCuentaPorPagar>(
      FacturaActionTypes.SaldarCuentaPorPagar
    ),
    map(action => action.payload),
    switchMap(factura => {
      return this.service.saldar(factura).pipe(
        map(res => new fromActions.UpdateFacturaSuccess(res)),
        catchError(error => of(new fromActions.UpdateFacturaFail(error)))
      );
    })
  );

  @Effect()
  buscarPendientes$ = this.actions$.pipe(
    ofType<fromActions.BuscarPendientesPorProveedor>(
      FacturaActionTypes.BuscarPendientesPorProveedor
    ),
    map(action => action.payload),
    switchMap(filtro => {
      return this.service.pendientes(filtro.proveedorId).pipe(
        map(res => new fromActions.BuscarPendientesPorProveedorSuccess(res)),
        catchError(error =>
          of(new fromActions.BuscarPendientesPorProveedorFail(error))
        )
      );
    })
  );
}
