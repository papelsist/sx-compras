import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ChequeDevueltoActionTypes } from '../actions/cheque-devuelto.actions';
import * as fromActions from '../actions/cheque-devuelto.actions';
import { getChequeDevueltosFilter } from '../../store/selectors';

import { ChequeDevueltoService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class ChequeDevueltoEffects {
  constructor(
    private actions$: Actions,
    private service: ChequeDevueltoService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetChequeDevueltosFilter>(
      ChequeDevueltoActionTypes.SetChequeDevueltosFilter
    ),
    map(action => new fromActions.LoadChequeDevueltos())
  );

  @Effect()
  loadChequeDevueltos$ = this.actions$.pipe(
    ofType(ChequeDevueltoActionTypes.LoadChequeDevueltos),
    switchMap(() => {
      return this.store.pipe(
        select(getChequeDevueltosFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(cheques => new fromActions.LoadChequeDevueltosSuccess({ cheques })),
        catchError(error =>
          of(new fromActions.ChequeDevueltosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  createChequeDevuelto$ = this.actions$.pipe(
    ofType<fromActions.CreateChequeDevuelto>(
      ChequeDevueltoActionTypes.CreateChequeDevuelto
    ),
    map(action => action.payload.cheque),
    switchMap(cheque => {
      return this.service.save(cheque).pipe(
        map(
          res => new fromActions.CreateChequeDevueltoSuccess({ cheque: res })
        ),
        catchError(error =>
          of(new fromActions.ChequeDevueltosFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  deleteChequeDevuelto$ = this.actions$.pipe(
    ofType<fromActions.DeleteChequeDevuelto>(
      ChequeDevueltoActionTypes.DeleteChequeDevuelto
    ),
    map(action => action.payload.cheque),
    switchMap(cheque => {
      return this.service.delete(cheque).pipe(
        map(() => new fromActions.DeleteChequeDevueltoSuccess({ cheque })),
        catchError(error =>
          of(new fromActions.ChequeDevueltosFail({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<fromActions.CreateChequeDevueltoSuccess>(
      ChequeDevueltoActionTypes.CreateChequeDevueltoSuccess
    ),
    map(action => action.payload.cheque),
    tap(cheque =>
      this.snackBar.open(
        `ChequeDevuelto  ${cheque.folio} generado exitosamente`,
        'Cerrar',
        {
          duration: 7000
        }
      )
    )
  );

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteChequeDevueltoSuccess>(
      ChequeDevueltoActionTypes.DeleteChequeDevueltoSuccess
    ),
    map(action => action.payload.cheque),
    tap(cheque =>
      this.snackBar.open(
        `ChequeDevuelto ${cheque.folio} eliminado exitosamente`,
        'Cerrar',
        {
          duration: 7000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.ChequeDevueltosFail>(
      ChequeDevueltoActionTypes.ChequeDevueltosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
