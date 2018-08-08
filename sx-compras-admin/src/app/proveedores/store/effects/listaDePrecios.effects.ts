import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  map,
  tap,
  switchMap,
  concatMap,
  catchError,
  take
} from 'rxjs/operators';
import { of } from 'rxjs';

import * as listasActions from '../actions/listasDePrecios.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromSelectors from '../../store/selectors';

@Injectable()
export class ListaDePreciosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ListaDePreciosProveedorService,
    private store: Store<fromStore.ProveedoresState>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  addLista = this.actions$.pipe(
    ofType<listasActions.AddListaDePreciosProveedor>(
      listasActions.ADD_LISTA_PROVEEDOR
    ),
    map(action => action.payload),
    switchMap(lista => {
      return this.service
        .save(lista)
        .pipe(
          map(res => new listasActions.AddListaDePreciosProveedorSuccess(res)),
          catchError(error =>
            of(new listasActions.AddListaDePreciosProveedorFail(error))
          )
        );
    })
  );

  @Effect()
  addListaSuccess = this.actions$.pipe(
    ofType<listasActions.AddListaDePreciosProveedorSuccess>(
      listasActions.ADD_LISTA_PROVEEDOR_SUCCESS
    ),
    map(action => action.payload),
    map(
      lista =>
        new fromRoot.Go({ path: [`proveedores/${lista.proveedor.id}/listas`] })
    )
  );

  @Effect()
  loadListas$ = this.actions$.ofType(listasActions.LOAD_LISTAS_PROVEEDOR).pipe(
    switchMap(() => {
      return this.store.pipe(
        select(fromSelectors.getSelectedProveedor),
        take(1)
      );
    }),
    switchMap(proveedor => {
      return this.service
        .list(proveedor.id)
        .pipe(
          map(
            listas =>
              new listasActions.LoadListasDePreciosProveedorSuccess(listas)
          ),
          catchError(error =>
            of(new listasActions.LoadListasDePreciosProveedorFail(error))
          )
        );
    })
  );

  @Effect()
  updateLista$ = this.actions$
    .ofType(listasActions.UPDATE_LISTA_PROVEEDOR)
    .pipe(
      map(
        (action: listasActions.UpdateListaDePreciosProveedor) => action.payload
      ),
      switchMap(proveedor => {
        return this.service
          .update(proveedor)
          .pipe(
            map(
              res => new listasActions.UpdateListaDePreciosProveedorSuccess(res)
            ),
            catchError(error =>
              of(new listasActions.UpdateListaDePreciosProveedorFail(error))
            )
          );
      })
    );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<listasActions.UpdateListaDePreciosProveedorSuccess>(
      listasActions.UPDATE_LISTA_PROVEEDOR_SUCCESS
    ),
    map(action => action.payload),
    tap(lista =>
      this.snackBar.open(
        `Lista de precios ${lista.id} actualizada `,
        'Cerrar',
        {
          duration: 2000
        }
      )
    ),
    map(
      lista =>
        new fromRoot.Go({ path: [`proveedores/${lista.proveedor.id}/listas`] })
    )
  );

  @Effect()
  aplicarLista$ = this.actions$
    .ofType<listasActions.AplicarListaProveedor>(
      listasActions.APLICAR_LISTA_PROVEEDOR
    )
    .pipe(
      map(action => action.payload),
      switchMap(lista => {
        return this.service
          .aplicar(lista)
          .pipe(
            map(res => new listasActions.AplicarListaProveedorSuccess(res)),
            catchError(error =>
              of(new listasActions.AplicarListaProveedorFail(error))
            )
          );
      })
    );

  @Effect()
  aplicarListaSuccess$ = this.actions$.pipe(
    ofType<listasActions.AplicarListaProveedorSuccess>(
      listasActions.APLICAR_LISTA_PROVEEDOR_SUCCESS
    ),
    map(action => action.payload),
    map(
      lista =>
        new fromRoot.Go({ path: [`proveedores/${lista.proveedor.id}/listas`] })
    )
  );

  @Effect({ dispatch: false })
  aplicarListaFail$ = this.actions$.pipe(
    ofType<listasActions.AplicarListaProveedorFail>(
      listasActions.APLICAR_LISTA_PROVEEDOR_FAIL
    ),
    map(action => action.payload),
    tap((error: HttpErrorResponse) =>
      this.snackBar.open(
        `Error ${error.status} al intentar tratar de aplicar lista `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  actualiarLista$ = this.actions$
    .ofType<listasActions.ActualizarProductosDeLista>(
      listasActions.ACTUALIZAR_PRODUCTOS_DE_LISTA_PROVEEDOR
    )
    .pipe(
      map(action => action.payload),
      switchMap(lista => {
        return this.service
          .actualizar(lista)
          .pipe(
            map(
              res => new listasActions.UpdateListaDePreciosProveedorSuccess(res)
            ),
            catchError(error =>
              of(new listasActions.UpdateListaDePreciosProveedorFail(error))
            )
          );
      })
    );

  @Effect()
  deleteLista$ = this.actions$.pipe(
    ofType<listasActions.DeleteListaDePreciosProveedor>(
      listasActions.DELETE_LISTA_PROVEEDOR
    ),
    map(action => action.payload),
    concatMap(lista => {
      return this.service
        .delete(lista.id)
        .pipe(
          map(
            res => new listasActions.DeleteListaDePreciosProveedorSuccess(lista)
          ),
          catchError(error =>
            of(new listasActions.DeleteListaDePreciosProveedorFail(error))
          )
        );
    })
  );

  @Effect()
  deleteListaSuccess$ = this.actions$.pipe(
    ofType<listasActions.DeleteListaDePreciosProveedorSuccess>(
      listasActions.DELETE_LISTA_PROVEEDOR_SUCCESS
    ),
    map(action => action.payload),
    map(
      lista =>
        new fromRoot.Go({ path: [`proveedores/${lista.proveedor.id}/listas`] })
    )
  );

  @Effect()
  actualizarCompras$ = this.actions$
    .ofType<listasActions.ActualizarComprasConLista>(
      listasActions.ACTUALIZAR_COMPRAS_CONLISTA
    )
    .pipe(
      map(action => action.payload),
      switchMap(data => {
        return this.service
          .actualizarCompras(data.lista, data.fecha)
          .pipe(
            map(res => new listasActions.ActualizarComprasConListaSuccess(res)),
            catchError(error =>
              of(new listasActions.ActualizarComprasConListaFail(error))
            )
          );
      })
    );
}
