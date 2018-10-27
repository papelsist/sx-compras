import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { RembolsoActionTypes } from '../actions/rembolso.actions';
import * as fromActions from '../actions/rembolso.actions';
import { getRembolsosFilter } from '../../store/selectors/rembolso.selectors';

import { RembolsoService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class RembolsosEffects {
  constructor(
    private actions$: Actions,
    private service: RembolsoService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetRembolsosFilter>(
      RembolsoActionTypes.SetRembolsosFilter
    ),
    map(action => new fromActions.LoadRembolsos())
  );

  @Effect()
  loadRembolsos$ = this.actions$.pipe(
    ofType(RembolsoActionTypes.LoadRembolsos),
    switchMap(() => {
      return this.store.pipe(
        select(getRembolsosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(rembolsos => new fromActions.LoadRembolsosSuccess({ rembolsos })),
        catchError(error =>
          of(new fromActions.LoadRembolsosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  pagoRembolso$ = this.actions$.pipe(
    ofType<fromActions.PagoRembolso>(RembolsoActionTypes.PagoRembolso),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.pagar(pago).pipe(
        map(res => new fromActions.PagoRembolsoSuccess({ rembolso: res })),
        catchError(error =>
          of(new fromActions.PagoRembolsoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  cancelarPago$ = this.actions$.pipe(
    ofType<fromActions.CancelarPagoRembolso>(
      RembolsoActionTypes.CancelarPagoRembolso
    ),
    map(action => action.payload.rembolso),
    switchMap(rembolso => {
      return this.service.cancelarPago(rembolso).pipe(
        map(
          res => new fromActions.CancelarPagoRembolsoSuccess({ rembolso: res })
        ),
        catchError(error =>
          of(new fromActions.CancelarPagoRembolsoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  cancelarCheque$ = this.actions$.pipe(
    ofType<fromActions.CancelarChequeRembolso>(
      RembolsoActionTypes.CancelarChequeRembolso
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.cancelarCheque(payload.id, payload.comentario).pipe(
        map(
          res =>
            new fromActions.CancelarChequeRembolsoSuccess({ rembolso: res })
        ),
        catchError(error =>
          of(new fromActions.CancelarChequeRembolsoFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  generarCheque$ = this.actions$.pipe(
    ofType<fromActions.GenerarChequeRembolso>(
      RembolsoActionTypes.GenerarChequeRembolso
    ),
    map(action => action.payload.rembolso),
    switchMap(rembolso => {
      return this.service.generarCheque(rembolso).pipe(
        map(
          res => new fromActions.GenerarChequeRembolsoSuccess({ rembolso: res })
        ),
        catchError(error =>
          of(new fromActions.GenerarChequeRembolsoFail({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  pagoSuccess$ = this.actions$.pipe(
    ofType<
      | fromActions.PagoRembolsoSuccess
      | fromActions.CancelarPagoRembolsoSuccess
      | fromActions.GenerarChequeRembolsoSuccess
    >(
      RembolsoActionTypes.PagoRembolsoSuccess,
      RembolsoActionTypes.CancelarPagoRembolsoSuccess,
      RembolsoActionTypes.GenerarChequeRembolsoSuccess
    ),
    map(action => action.payload.rembolso),
    tap(rembolso =>
      this.snackBar.open(
        `Rembolso ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadRembolsosFail
      | fromActions.PagoRembolsoFail
      | fromActions.CancelarPagoRembolsoFail
      | fromActions.GenerarChequeRembolsoFail
    >(
      RembolsoActionTypes.LoadRembolsosFail,
      RembolsoActionTypes.PagoRembolsoFail,
      RembolsoActionTypes.CancelarPagoRembolsoFail,
      RembolsoActionTypes.GenerarChequeRembolsoFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
