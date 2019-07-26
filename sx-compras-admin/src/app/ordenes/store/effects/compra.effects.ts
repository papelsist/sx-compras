import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getComprasPeriodo } from '../selectors/compra.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CompraActionTypes } from '../actions/compra.actions';
import * as fromActions from '../actions/compra.actions';
import { ComprasService } from '../../services';

import { MatSnackBar } from '@angular/material';
import { Periodo } from 'app/_core/models/periodo';
import { ComprasPeriodoStoeKey } from '../reducers/compra.reducer';

@Injectable()
export class CompraEffects {
  constructor(
    private actions$: Actions,
    private service: ComprasService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadCompras$ = this.actions$.pipe(
    ofType(CompraActionTypes.LoadCompras),
    switchMap(() => {
      return this.store.pipe(
        select(getComprasPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(res => new fromActions.LoadComprasSuccess(res)),
        catchError(error => of(new fromActions.LoadComprasFail(error)))
      );
    })
  );

  @Effect()
  periodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodo>(CompraActionTypes.SetPeriodo),
    map(action => action.payload.periodo),
    tap(periodo => Periodo.saveOnStorage(ComprasPeriodoStoeKey, periodo)),
    map(() => new fromActions.LoadCompras())
  );

  @Effect()
  addCompra$ = this.actions$.pipe(
    ofType<fromActions.AddCompra>(CompraActionTypes.AddCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service.save(compra).pipe(
        map(res => new fromActions.AddCompraSuccess(res)),
        catchError(error => of(new fromActions.AddCompraFail(error)))
      );
    })
  );

  @Effect()
  addCompraSuccess$ = this.actions$.pipe(
    ofType(
      CompraActionTypes.AddCompraSuccess,
      CompraActionTypes.UpdateCompraSuccess
    ),
    map((action: any) => action.payload),
    map(compra => new fromRoot.Go({ path: ['ordenes/compras', compra.id] }))
  );

  @Effect()
  updateCompra$ = this.actions$.pipe(
    ofType<fromActions.UpdateCompra>(CompraActionTypes.UpdateCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service.update(compra).pipe(
        map(res => new fromActions.UpdateCompraSuccess(res)),
        catchError(error => of(new fromActions.UpdateCompraFail(error)))
      );
    })
  );

  @Effect()
  deleteCompra$ = this.actions$.pipe(
    ofType<fromActions.DeleteCompra>(CompraActionTypes.DeleteCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service.delete(compra.id).pipe(
        map(res => new fromActions.DeleteCompraSuccess(compra)),
        catchError(error => of(new fromActions.LoadComprasFail(error)))
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(CompraActionTypes.DeleteCompraSuccess),
    map(() => new fromRoot.Go({ path: ['ordenes/compras'] }))
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateCompraSuccess>(
      CompraActionTypes.UpdateCompraSuccess
    ),
    map(action => action.payload),
    tap(compra =>
      this.snackBar.open(`Compra ${compra.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    )
    // map(compra => new fromRoot.Go({ path: ['ordenes/compras', compra.id] }))
  );

  @Effect()
  cerrarCompra$ = this.actions$.pipe(
    ofType<fromActions.CerrarCompra>(CompraActionTypes.CerrarCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service.cerrar(compra).pipe(
        map(res => new fromActions.UpdateCompraSuccess(res)),
        catchError(error => of(new fromActions.UpdateCompraFail(error)))
      );
    })
  );

  @Effect()
  depurarCompra$ = this.actions$.pipe(
    ofType<fromActions.DepurarCompra>(CompraActionTypes.DepurarCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service.depurar(compra).pipe(
        map(res => new fromActions.UpdateCompraSuccess(res)),
        catchError(error => of(new fromActions.UpdateCompraFail(error)))
      );
    })
  );

  @Effect()
  actualizarPrecios$ = this.actions$.pipe(
    ofType<fromActions.ActualizarPrecios>(CompraActionTypes.ActualizarPrecios),
    map(action => action.payload.compraId),
    switchMap(compraId => {
      return this.service.actualizarPrecios(compraId).pipe(
        map(res => new fromActions.ActualizarPreciosSuccess({ compra: res })),
        catchError(error =>
          of(new fromActions.ActualizarPreciosFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<fromActions.ActualizarPreciosFail>(
      CompraActionTypes.ActualizarPreciosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
