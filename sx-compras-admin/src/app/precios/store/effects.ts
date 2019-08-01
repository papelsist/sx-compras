import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './reducer';
import { selectPeriodo } from './selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { ListaActionTypes } from './actions';
import * as fromActions from './actions';

import { ListaDePreciosVentaService } from '../services/lista-de-precios-venta.service';

@Injectable()
export class ListaDePreciosEffects {
  constructor(
    private actions$: Actions,
    private service: ListaDePreciosVentaService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(ListaActionTypes.LoadListaDePrecios),
    switchMap(() => {
      return this.store.pipe(
        select(selectPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(
          listas =>
            new fromActions.LoadListaDePreciosSuccess({
              listas
            })
        ),
        catchError(response =>
          of(new fromActions.LoadListaDePreciosFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateLista>(ListaActionTypes.CreateLista),
    map(action => action.payload.lista),
    switchMap(req => {
      return this.service.save(req).pipe(
        map(
          lista =>
            new fromActions.CreateListaSuccess({
              lista
            })
        ),
        catchError(response =>
          of(new fromActions.CreateListaFail({ response }))
        )
      );
    })
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreateListaSuccess>(ListaActionTypes.CreateListaSuccess),
    map(action => action.payload.lista),
    map(r => new fromRoot.Go({ path: ['/catalogos/lista', r.id] }))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateLista>(ListaActionTypes.UpdateLista),
    map(action => action.payload.update),
    switchMap(upd => {
      return this.service.update(upd).pipe(
        map(
          lista =>
            new fromActions.UpdateListaSuccess({
              lista
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateListaFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteLista>(ListaActionTypes.DeleteLista),
    map(action => action.payload.lista),
    switchMap(lista => {
      return this.service.delete(lista.id).pipe(
        map(
          () =>
            new fromActions.DeleteListaSuccess({
              lista
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteListaFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteListaSuccess>(ListaActionTypes.DeleteListaSuccess),
    map(action => action.payload.lista),
    map(r => new fromRoot.Go({ path: ['catalogos/listas'] }))
  );

  @Effect()
  aplicar$ = this.actions$.pipe(
    ofType<fromActions.AplicarListaDePrecios>(
      ListaActionTypes.AplicarListaDePrecios
    ),
    map(action => action.payload.lista),
    switchMap(lista => {
      return this.service.aplicar(lista.id).pipe(
        map(
          res =>
            new fromActions.AplicarListaDePreciosSuccess({
              lista: res
            })
        ),
        catchError(response =>
          of(new fromActions.AplicarListaDePreciosFail({ response }))
        )
      );
    })
  );

  @Effect()
  disponibles$ = this.actions$.pipe(
    ofType(ListaActionTypes.LoadDisponibles),
    switchMap(() => {
      return this.service.disponibles().pipe(
        map(
          rows =>
            new fromActions.LoadDisponiblesSuccess({
              rows
            })
        ),
        catchError(response =>
          of(new fromActions.LoadDisponiblesFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadListaDePreciosFail
      | fromActions.CreateListaFail
      | fromActions.UpdateListaFail
      | fromActions.DeleteListaFail
      | fromActions.AplicarListaDePreciosFail
      | fromActions.LoadDisponiblesFail
    >(
      ListaActionTypes.LoadListaDePreciosFail,
      ListaActionTypes.CreateListaFail,
      ListaActionTypes.UpdateListaFail,
      ListaActionTypes.DeleteListaFail,
      ListaActionTypes.AplicarListaDePreciosFail,
      ListaActionTypes.LoadDisponiblesFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
