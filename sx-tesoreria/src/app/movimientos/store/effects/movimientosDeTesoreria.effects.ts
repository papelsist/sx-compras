import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { MovimientoActionTypes } from '../actions/movimientoDeTesoreria.actions';
import * as fromActions from '../actions/movimientoDeTesoreria.actions';
import { getMovimientosFilter } from '../../store/selectors/movimientosDeTesoreria.selectors';

import { MovimientoDeTesoreriaService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class MovimientosDeTesoreriaEffects {
  constructor(
    private actions$: Actions,
    private service: MovimientoDeTesoreriaService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetMovimientosFilter>(
      MovimientoActionTypes.SetMovimientosFilter
    ),
    map(action => new fromActions.LoadMovimientos())
  );

  @Effect()
  loadMovimientos$ = this.actions$.pipe(
    ofType(MovimientoActionTypes.LoadMovimientos),
    switchMap(() => {
      return this.store.pipe(
        select(getMovimientosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(
          movimientos => new fromActions.LoadMovimientosSuccess({ movimientos })
        ),
        catchError(error =>
          of(new fromActions.MovimientoError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateMovimiento>(
      MovimientoActionTypes.CreateMovimiento
    ),
    map(action => action.payload.movimiento),
    switchMap(movimiento => {
      return this.service.save(movimiento).pipe(
        map(
          res => new fromActions.CreateMovimientoSuccess({ movimiento: res })
        ),
        catchError(error =>
          of(new fromActions.MovimientoError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteMovimiento>(
      MovimientoActionTypes.DeleteMovimiento
    ),
    map(action => action.payload.movimiento),
    switchMap(movimiento => {
      return this.service.delete(movimiento).pipe(
        map(res => new fromActions.DeleteMovimientoSuccess({ movimiento })),
        catchError(error =>
          of(new fromActions.MovimientoError({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateMovimiento>(
      MovimientoActionTypes.UpdateMovimiento
    ),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(
          movimiento => new fromActions.UpdateMovimientoSuccess({ movimiento })
        ),
        catchError(error =>
          of(new fromActions.MovimientoError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<
      fromActions.CreateMovimientoSuccess | fromActions.UpdateMovimientoSuccess
    >(
      MovimientoActionTypes.CreateMovimientoSuccess,
      MovimientoActionTypes.UpdateMovimientoSuccess
    ),
    map(action => action.payload.movimiento),
    tap(rembolso =>
      this.snackBar.open(
        `Movimiento ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.MovimientoError>(MovimientoActionTypes.MovimientoError),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
