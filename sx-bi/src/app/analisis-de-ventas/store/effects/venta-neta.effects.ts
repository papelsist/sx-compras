import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/venta-neta.actions';
import { getVentaNetaFilter } from '../../store/selectors/venta-neta.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { VentasService } from 'app/analisis-de-ventas/services';

@Injectable()
export class VentaNetaEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar,
    private service: VentasService
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetVentaNetaFilter>(
      fromActions.VentaNetaActionTypes.SetVentaNetaFilter
    ),
    map(action => new fromActions.LoadVentasNetas())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.LoadVentasNetas>(
      fromActions.VentaNetaActionTypes.LoadVentasNetas
    ),
    switchMap(() => {
      return this.store.pipe(
        select(getVentaNetaFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.ventaNetaMensual(filter).pipe(
        map(res => new fromActions.LoadVentasNetasSuccess(res)),
        catchError(error => of(new fromActions.LoadVentasNetasFail(error)))
      )
    )
  );
}
