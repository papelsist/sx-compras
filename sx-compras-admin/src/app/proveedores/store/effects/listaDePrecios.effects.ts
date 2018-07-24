import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as listasActions from '../actions/listasDePrecios.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ListaDePreciosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ListaDePreciosProveedorService,
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
      return this.service
        .list()
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

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<listasActions.UpdateListaDePreciosProveedorSuccess>(
      listasActions.UPDATE_LISTA_PROVEEDOR_SUCCESS
    ),
    map(action => action.payload),
    tap(lista =>
      this.snackBar.open(`Proveedor ${lista.id} actualizada `, 'Cerrar', {
        duration: 2000
      })
    )
  );
}
