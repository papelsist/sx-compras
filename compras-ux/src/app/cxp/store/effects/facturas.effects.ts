import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getPeriodoDeFacturas } from '../selectors/facturas.selector';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import {
  FacturaActionTypes,
  FacturaActions
} from '../actions/facturas.actions';
import * as fromActions from '../actions/facturas.actions';
import { CuentaPorPagarService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class FacturasEffects {
  constructor(
    private actions$: Actions,
    private service: CuentaPorPagarService,
    private store: Store<fromStore.CxpState>,
    private snackBar: MatSnackBar
  ) {}

  /*
  @Effect()
  loadFacturas$ = this.actions$.pipe(
    ofType(FacturaActionTypes.LoadFacturas),
    switchMap(() => {
      return this.store.pipe(select(getPeriodoDeFacturas), take(1));
    }),
    switchMap(periodo => {
      return this.service
        .list(periodo)
        .pipe(
          map(res => new fromActions.LoadFacturasSuccess(res)),
          catchError(error => of(new fromActions.LoadFacturasFail(error)))
        );
    })
  );
  */
  @Effect()
  loadFacturas$ = this.actions$.pipe(
    ofType(FacturaActionTypes.LoadFacturas),
    switchMap(() => {
      return this.service.cartera().pipe(
        map(res => new fromActions.LoadFacturasSuccess(res)),
        catchError(error => of(new fromActions.LoadFacturasFail(error)))
      );
    })
  );

  @Effect()
  setPeriodo$ = this.actions$.pipe(
    ofType<fromActions.SetFacturasPeriodo>(
      FacturaActionTypes.SetFacturasPeriodo
    ),
    map(action => action.payload),
    tap(periodo =>
      Periodo.saveOnStorage('sx-compras.cxp.facturas.periodo', periodo)
    ),
    map(() => new fromActions.LoadFacturas())
  );

  @Effect()
  updateFactura$ = this.actions$.pipe(
    ofType<fromActions.UpdateFactura>(FacturaActionTypes.UpdateFactura),
    map(action => action.payload),
    switchMap(factura => {
      return this.service.update(factura).pipe(
        map(res => new fromActions.UpdateFacturaSuccess(res)),
        catchError(error => of(new fromActions.UpdateFacturaFail(error)))
      );
    })
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateFacturaSuccess>(
      FacturaActionTypes.UpdateFacturaSuccess
    ),
    map(action => action.payload),
    tap(factura =>
      this.snackBar.open(`Factura ${factura.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(factura => new fromRoot.Go({ path: ['cxp/facturas', factura.id] }))
  );

  @Effect()
  saldarFactura$ = this.actions$.pipe(
    ofType<fromActions.SaldarCuentaPorPagar>(
      FacturaActionTypes.SaldarCuentaPorPagar
    ),
    map(action => action.payload),
    switchMap(factura => {
      return this.service.saldar(factura).pipe(
        map(res => new fromActions.UpsertFactura({factura: res})),
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
