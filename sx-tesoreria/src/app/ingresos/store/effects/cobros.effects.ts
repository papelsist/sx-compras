import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of, from } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CobroActionTypes } from '../actions/cobros.actions';
import * as fromActions from '../actions/cobros.actions';
import { getCobrosFilter } from '../../store/selectors';

import { CobroService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CobrosEffects {
  constructor(
    private actions$: Actions,
    private service: CobroService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetCobrosFilter>(CobroActionTypes.SetCobrosFilter),
    map(action => new fromActions.LoadCobros())
  );

  @Effect()
  loadCobros$ = this.actions$.pipe(
    ofType(CobroActionTypes.LoadCobros),
    switchMap(() => {
      return this.store.pipe(
        select(getCobrosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(cobros => new fromActions.LoadCobrosSuccess({ cobros })),
        catchError(error =>
          of(new fromActions.LoadCobrosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  createCobro$ = this.actions$.pipe(
    ofType<fromActions.CreateCobro>(CobroActionTypes.CreateCobro),
    map(action => action.payload.cobro),
    switchMap(cobro => {
      return this.service.save(cobro).pipe(
        map(res => new fromActions.CreateCobroSuccess({ cobro: res })),
        catchError(error =>
          of(new fromActions.CreateCobroFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  updateCobro$ = this.actions$.pipe(
    ofType<fromActions.UpdateCobro>(CobroActionTypes.UpdateCobro),
    map(action => action.payload.cobro),
    switchMap(cobro => {
      return this.service.update({ id: cobro.id, changes: cobro.changes }).pipe(
        map(res => new fromActions.UpdateCobroSuccess({ cobro: res })),
        catchError(error =>
          of(new fromActions.UpdateCobroFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  deleteCobro$ = this.actions$.pipe(
    ofType<fromActions.DeleteCobro>(CobroActionTypes.DeleteCobro),
    map(action => action.payload.cobro),
    switchMap(cobro => {
      return this.service.delete(cobro).pipe(
        map(() => new fromActions.DeleteCobroSuccess({ cobro })),
        catchError(error =>
          of(new fromActions.DeleteCobroFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  devolverCobro$ = this.actions$.pipe(
    ofType<fromActions.DevolverCheque>(CobroActionTypes.DevolverCheque),
    map(action => action.payload),
    switchMap(cmd => {
      return this.service.registrarChequeDevuelto(cmd.fecha, cmd.cobro).pipe(
        map(res => new fromActions.DevolverChequeSuccess({ cobro: res })),
        catchError(error =>
          of(new fromActions.DevolverChequeFail({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateCobroSuccess | fromActions.CreateCobroSuccess>(
      CobroActionTypes.UpdateCobroSuccess,
      CobroActionTypes.CreateCobroSuccess,
      CobroActionTypes.DeleteCobroSuccess,
      CobroActionTypes.DevolverChequeSuccess
    ),
    map(action => action.payload.cobro),
    tap(cobro =>
      this.snackBar.open(
        `Cobro registrado/actualizado ${cobro.importe} exitosamente`,
        'Cerrar',
        {
          duration: 7000
        }
      )
    )
  );

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteCobroSuccess>(CobroActionTypes.DeleteCobroSuccess),
    map(action => action.payload.cobro),
    tap(cobro =>
      this.snackBar.open(
        `Cobro ${cobro.importe} eliminado exitosamente`,
        'Cerrar',
        {
          duration: 7000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadCobrosFail
      | fromActions.UpdateCobroFail
      | fromActions.CreateCobroFail
      | fromActions.DeleteCobroFail
    >(
      CobroActionTypes.LoadCobrosFail,
      CobroActionTypes.UpdateCobroFail,
      CobroActionTypes.CreateCobroFail,
      CobroActionTypes.DeleteCobroFail,
      CobroActionTypes.DevolverChequeFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
