import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getPeriodoDeCompras } from '../selectors/compra.selectors';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  catchError,
  take,
  delay,
  mergeMap
} from 'rxjs/operators';

import { CompraActionTypes, CompraActions } from '../actions/compra.actions';
import * as fromActions from '../actions/compra.actions';
import { ComprasService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

import { MatSnackBar } from '@angular/material';
import { TdDialogService } from '@covalent/core';

@Injectable()
export class CompraEffects {
  constructor(
    private actions$: Actions,
    private service: ComprasService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar,
    private dialogService: TdDialogService
  ) {}

  @Effect()
  loadCompras$ = this.actions$.pipe(
    ofType(CompraActionTypes.LoadCompras),
    switchMap(() => {
      return this.store.pipe(select(getPeriodoDeCompras), take(1));
    }),
    switchMap(periodo => {
      return this.service
        .list(periodo)
        .pipe(
          map(res => new fromActions.LoadComprasSuccess(res)),
          catchError(error => of(new fromActions.LoadComprasFail(error)))
        );
    })
  );

  @Effect()
  setPeriodo$ = this.actions$.pipe(
    ofType<fromActions.SetPeriodo>(CompraActionTypes.SetPeriodo),
    map(action => action.payload),
    tap(periodo =>
      Periodo.saveOnStorage('sx-compras.compras.periodo', periodo)
    ),
    map(() => new fromActions.LoadCompras())
  );

  @Effect()
  addCompra$ = this.actions$.pipe(
    ofType<fromActions.AddCompra>(CompraActionTypes.AddCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service
        .save(compra)
        .pipe(
          map(res => new fromActions.AddCompraSuccess(res)),
          catchError(error => of(new fromActions.AddCompraFail(error)))
        );
    })
  );

  @Effect()
  addCompraSuccess$ = this.actions$.pipe(
    ofType(CompraActionTypes.AddCompraSuccess),
    map((action: any) => action.payload),
    map(compra => new fromRoot.Go({ path: ['ordenes', compra.id] }))
  );

  @Effect()
  updateCompra$ = this.actions$.pipe(
    ofType<fromActions.UpdateCompra>(CompraActionTypes.UpdateCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service
        .update(compra)
        .pipe(
          map(res => new fromActions.UpsertCompra({ compra: res })),
          catchError(error => of(new fromActions.UpdateCompraFail(error)))
        );
    })
  );

  @Effect()
  deleteCompra$ = this.actions$.pipe(
    ofType<fromActions.DeleteCompra>(CompraActionTypes.DeleteCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service
        .delete(compra.id)
        .pipe(
          map(res => new fromActions.DeleteCompraSuccess(compra)),
          catchError(error => of(new fromActions.LoadComprasFail(error)))
        );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(CompraActionTypes.DeleteCompraSuccess),
    map(() => new fromRoot.Go({ path: ['compras'] }))
  );

  /*
  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateCompraSuccess>(
      CompraActionTypes.UpdateCompraSuccess
    ),
    map(action => action.payload),
    tap(compra =>
      this.snackBar.open(`Compra ${compra.folio} actualizada `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(compra => new fromRoot.Go({ path: ['compras', compra.id] }))
  );
  */

  @Effect()
  cerrarCompra$ = this.actions$.pipe(
    ofType<fromActions.CerrarCompra>(CompraActionTypes.CerrarCompra),
    map(action => action.payload),
    switchMap(compra => {
      return this.service
        .cerrar(compra)
        .pipe(
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
      return this.service
        .depurar(compra)
        .pipe(
          map(res => new fromActions.UpdateCompraSuccess(res)),
          catchError(error => of(new fromActions.UpdateCompraFail(error)))
        );
    })
  );

  /*
  @Effect({ dispatch: false })
  setSearchterm$ = this.actions$.pipe(
    ofType<fromActions.SetSearchTerm>(CompraActionTypes.SetSearchTerm),
    map(action => action.payload),
    tap(term => localStorage.setItem('sx-compras.compras.searchTerm', term))
  );
  */

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.GetCompra>(CompraActionTypes.GetCompra),
    map(action => action.payload.id),
    mergeMap(compraId => {
      return this.service
        .get(compraId)
        .pipe(
          map(compra => new fromActions.UpsertCompra({ compra })),
          catchError(error => of(new fromActions.GetCompraFail(error)))
        );
    })
  );

  @Effect({ dispatch: false })
  httpFail$ = this.actions$.pipe(
    ofType<fromActions.AddCompraFail | fromActions.UpdateCompraFail>(
      CompraActionTypes.AddCompraFail,
      CompraActionTypes.UpdateCompraFail
    ),
    map(action => action.payload),
    tap(response => {
      const message = response.error ? response.error.message : 'Error';
      console.error('Error: ', response.message);
      this.dialogService.openAlert({
        message: `${response.status} ${message}`,
        title: `Error ${response.status}`,
        closeButton: 'Cerrar'
      });
      /*
      this.snackBar.open(`Eerror ${response.status} `, 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top',
        politeness: 'assertive'
      });
      */
    })
  );
}
