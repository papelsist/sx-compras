import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromVentas from '../../store/actions/venta-neta.actions';
import * as fromActions from '../../store/actions/venta-por-producto';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  catchError,
  take,
  withLatestFrom,
  filter
} from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { VentasService } from 'app/analisis-de-ventas/services';

@Injectable()
export class VentaPorProductoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar,
    private service: VentasService
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromActions.LoadVentaPorProducto>(
      fromActions.VentaPorProductoActionTypes.LoadVentaPorProducto
    ),
    map(action => action.payload),
    switchMap(command =>
      this.service.movimientoCosteado(command.filter, command.origenId).pipe(
        map(res => new fromActions.LoadVentaPorProductoSuccess(res)),
        catchError(error =>
          of(new fromRoot.GlobalHttpError({ response: error }))
        )
      )
    )
  );
}
