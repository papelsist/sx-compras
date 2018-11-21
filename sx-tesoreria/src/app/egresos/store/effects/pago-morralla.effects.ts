import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { PagoDeMorrallaActionTypes } from '../actions/pago-morralla.actions';
import * as fromActions from '../actions/pago-morralla.actions';
import { getPagoDeMorrallasFilter } from '../../store/selectors/pago-morralla.selectors';

import { PagoDeMorrallaService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class PagoDeMorrallasEffects {
  constructor(
    private actions$: Actions,
    private service: PagoDeMorrallaService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetPagoDeMorrallasFilter>(
      PagoDeMorrallaActionTypes.SetPagoDeMorrallasFilter
    ),
    map(action => new fromActions.LoadPagoDeMorrallas())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType(PagoDeMorrallaActionTypes.LoadPagoDeMorrallas),
    switchMap(() => {
      return this.store.pipe(
        select(getPagoDeMorrallasFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(pagos => new fromActions.LoadPagoDeMorrallasSuccess({ pagos })),
        catchError(error =>
          of(new fromActions.PagoDeMorrallaError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreatePagarMorralla>(
      PagoDeMorrallaActionTypes.CreatePagarMorralla
    ),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.save(pago).pipe(
        map(res => new fromActions.CreatePagarMorrallaSuccess({ pago: res })),
        catchError(error =>
          of(new fromActions.PagoDeMorrallaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeletePagoDeMorralla>(
      PagoDeMorrallaActionTypes.DeletePagoDeMorralla
    ),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.delete(pago).pipe(
        map(res => new fromActions.DeletePagoDeMorrallaSuccess({ pago })),
        catchError(error =>
          of(new fromActions.PagoDeMorrallaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeletePagoDeMorrallaSuccess>(
      PagoDeMorrallaActionTypes.DeletePagoDeMorrallaSuccess
    ),
    map(() => new fromRoot.Go({ path: ['egresos/pagoMorralla'] }))
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreatePagarMorrallaSuccess>(
      PagoDeMorrallaActionTypes.CreatePagarMorrallaSuccess
    ),
    map(action => action.payload.pago),
    tap(pago =>
      this.snackBar.open(
        `Pago de morralla ${pago.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    ),
    map(() => new fromRoot.Go({ path: ['egresos/pagoMorralla'] }))
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.PagoDeMorrallaError>(
      PagoDeMorrallaActionTypes.PagoDeMorrallaError
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
