import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { getPeriodoDeCompras } from '../selectors/compra.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CompraActionTypes, CompraActions } from '../actions/compra.actions';
import * as fromActions from '../actions/compra.actions';
import { ComprasService } from '../../services';
import { Periodo } from '../../../_core/models/periodo';

@Injectable()
export class CompraEffects {
  constructor(
    private actions$: Actions,
    private service: ComprasService,
    private store: Store<fromStore.State>
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

  /*
  @Effect({ dispatch: false })
  setSearchterm$ = this.actions$.pipe(
    ofType<fromActions.SetSearchTerm>(CompraActionTypes.SetSearchTerm),
    map(action => action.payload),
    tap(term => localStorage.setItem('sx-compras.compras.searchTerm', term))
  );
  */
}
