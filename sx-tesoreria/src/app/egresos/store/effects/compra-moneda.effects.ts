import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CompraMonedaActionTypes } from '../actions/compra-moneda.actions';
import * as fromActions from '../actions/compra-moneda.actions';
import { getCompraMonedasFilter } from '../../store/selectors/compra-moneda.selectors';

import { CompraMonedaService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CompraMonedaEffects {
  constructor(
    private actions$: Actions,
    private service: CompraMonedaService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetCompraMonedasFilter>(
      CompraMonedaActionTypes.SetCompraMonedasFilter
    ),
    map(action => new fromActions.LoadCompraMonedas())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType(CompraMonedaActionTypes.LoadCompraMonedas),
    switchMap(() => {
      return this.store.pipe(
        select(getCompraMonedasFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(compras => new fromActions.LoadCompraMonedasSuccess({ compras })),
        catchError(error =>
          of(new fromActions.CompraMonedaError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateCompraMoneda>(
      CompraMonedaActionTypes.CreateCompraMoneda
    ),
    map(action => action.payload.compra),
    switchMap(compra => {
      return this.service.save(compra).pipe(
        map(res => new fromActions.CreateCompraMonedaSuccess({ compra: res })),
        catchError(error =>
          of(new fromActions.CompraMonedaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteCompraMoneda>(
      CompraMonedaActionTypes.DeleteCompraMoneda
    ),
    map(action => action.payload.compra),
    switchMap(compra => {
      return this.service.delete(compra).pipe(
        map(res => new fromActions.DeleteCompraMonedaSuccess({ compra })),
        catchError(error =>
          of(new fromActions.CompraMonedaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateCompraMoneda>(
      CompraMonedaActionTypes.UpdateCompraMoneda
    ),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(compra => new fromActions.UpdateCompraMonedaSuccess({ compra })),
        catchError(error =>
          of(new fromActions.CompraMonedaError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<
      | fromActions.CreateCompraMonedaSuccess
      | fromActions.UpdateCompraMonedaSuccess
    >(
      CompraMonedaActionTypes.CreateCompraMonedaSuccess,
      CompraMonedaActionTypes.UpdateCompraMonedaSuccess
    ),
    map(action => action.payload.compra),
    tap(rembolso =>
      this.snackBar.open(
        `Compra de moneda ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.CompraMonedaError>(
      CompraMonedaActionTypes.CompraMonedaError
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
