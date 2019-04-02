import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { EnvioComisionActionTypes } from '../actions/envio-comision.actions';
import * as fromActions from '../actions/envio-comision.actions';
import { getEnvioComisionFilter } from '../../store/selectors/envio-comision.selectors';

import { EnvioComisionService } from '../../services';

import { saveInLocalStorage } from '../../model';

import { MatSnackBar } from '@angular/material';
import { Periodo } from 'app/_core/models/periodo';

@Injectable()
export class EnvioComisionEffects {
  constructor(
    private actions$: Actions,
    private service: EnvioComisionService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetEnvioComisionesFilter>(
      EnvioComisionActionTypes.SetEnviosComisionFilter
    ),
    tap(action => {
      saveInLocalStorage(action.payload.filter);
    }),
    map(action => new fromActions.LoadEnvioComisiones())
  );

  @Effect()
  loadComisiones$ = this.actions$.pipe(
    ofType(EnvioComisionActionTypes.LoadEnvioComisiones),
    switchMap(() => {
      return this.store.pipe(
        select(getEnvioComisionFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(
          comisiones =>
            new fromActions.LoadEnvioComisionesSuccess({ comisiones })
        ),
        catchError(error =>
          of(new fromActions.LoadEnvioComisionesFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  generarComisiones$ = this.actions$.pipe(
    ofType<fromActions.GenerarComisiones>(
      EnvioComisionActionTypes.GenerarComisiones
    ),
    map(action => action.payload.periodo),
    switchMap(periodo =>
      this.service.generar(periodo).pipe(
        map(
          comisiones => new fromActions.GenerarComisionesSuccess({ comisiones })
        ),
        catchError(error =>
          of(new fromActions.GenerarComisionesFail({ response: error }))
        )
      )
    )
  );

  @Effect({ dispatch: false })
  generarComisionesSuccess$ = this.actions$.pipe(
    ofType<fromActions.GenerarComisionesSuccess>(
      EnvioComisionActionTypes.GenerarComisionesSuccess
    ),
    map(action => action.payload.comisiones),
    tap(comisiones => {
      /*
      this.snackBar.open(
        `${comisiones.length} comisiones de envio generadas`,
        'Cerrar',
        { duration: 5000 }
      );
      */
    })
  );

  @Effect()
  batchUpdate$ = this.actions$.pipe(
    ofType<fromActions.UpdateManyComisiones>(
      EnvioComisionActionTypes.UpdateManyComisiones
    ),
    map(action => action.payload.data),
    switchMap(data =>
      this.service.batchUpdate(data).pipe(
        map(
          comisiones =>
            new fromActions.UpdateManyComisionesSuccess({ comisiones })
        ),
        catchError(error =>
          of(new fromActions.UpdateManyComisionesFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadEnvioComisionesFail
      | fromActions.GenerarComisionesFail
      | fromActions.UpdateManyComisionesFail
    >(
      EnvioComisionActionTypes.UpdateManyComisionesFail,
      EnvioComisionActionTypes.LoadEnvioComisionesFail,
      EnvioComisionActionTypes.GenerarComisionesFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
