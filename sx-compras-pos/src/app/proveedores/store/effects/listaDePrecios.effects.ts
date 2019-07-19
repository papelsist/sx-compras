import { Injectable } from '@angular/core';

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

import * as fromStore from '../../store';
import * as fromSelectors from '../../store/selectors';

@Injectable()
export class ListaDePreciosEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ListaDePreciosProveedorService,
    private store: Store<fromStore.ProveedoresState>
  ) {}

  @Effect()
  loadListas$ = this.actions$.pipe(
    ofType(listasActions.LOAD_LISTAS_PROVEEDOR),
    switchMap(() => {
      return this.store.pipe(
        select(fromSelectors.getSelectedProveedor),
        take(1)
      );
    }),
    switchMap(proveedor => {
      return this.service.list(proveedor.id).pipe(
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
}
