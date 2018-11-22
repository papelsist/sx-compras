import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { DevolucionClienteActionTypes } from '../actions/devolucion-cliente.actions';
import * as fromActions from '../actions/devolucion-cliente.actions';
import { getDevolucionClienteFilter } from '../../store/selectors/devolucion-cliente.selectors';

import { DevolucionClienteService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class DevolucionClienteEffects {
  constructor(
    private actions$: Actions,
    private service: DevolucionClienteService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetDevolucionClientesFilter>(
      DevolucionClienteActionTypes.SetDevolucionClientesFilter
    ),
    map(action => new fromActions.LoadDevoluciones())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType(DevolucionClienteActionTypes.LoadDevoluciones),
    switchMap(() => {
      return this.store.pipe(
        select(getDevolucionClienteFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(
          devoluciones =>
            new fromActions.LoadDevolucionesSuccess({ devoluciones })
        ),
        catchError(error =>
          of(new fromActions.DevolucionClienteError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateDevolucionCliente>(
      DevolucionClienteActionTypes.CreateDevolucionCliente
    ),
    map(action => action.payload.devolucion),
    switchMap(devolucion => {
      return this.service.save(devolucion).pipe(
        map(
          res =>
            new fromActions.CreateDevolucionClienteSuccess({ devolucion: res })
        ),
        catchError(error =>
          of(new fromActions.DevolucionClienteError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteDevolucionCliente>(
      DevolucionClienteActionTypes.DeleteDevolucionCliente
    ),
    map(action => action.payload.devolucion),
    switchMap(devolucion => {
      return this.service.delete(devolucion).pipe(
        map(
          res => new fromActions.DeleteDevolucionClienteSuccess({ devolucion })
        ),
        catchError(error =>
          of(new fromActions.DevolucionClienteError({ response: error }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteDevolucionClienteSuccess>(
      DevolucionClienteActionTypes.DeleteDevolucionClienteSuccess
    ),
    map(() => new fromRoot.Go({ path: ['egresos/devolucionCliente'] }))
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreateDevolucionClienteSuccess>(
      DevolucionClienteActionTypes.CreateDevolucionClienteSuccess
    ),
    map(action => action.payload.devolucion),
    tap(devolucion =>
      this.snackBar.open(
        `Pago de morralla ${devolucion.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    ),
    map(
      devolucion =>
        new fromRoot.Go({ path: ['egresos/pagoMorralla', devolucion.id] })
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.DevolucionClienteError>(
      DevolucionClienteActionTypes.DevolucionClienteError
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
