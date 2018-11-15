import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { PagoDeNominaActionTypes } from '../actions/pago-nomina.actions';
import * as fromActions from '../actions/pago-nomina.actions';
import { getPagoDeNominasFilter } from '../../store/selectors/pago-nomina.selectors';

import { PagoDeNominaService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class PagoDeNominaEffects {
  constructor(
    private actions$: Actions,
    private service: PagoDeNominaService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetPagoDeNominasFilter>(
      PagoDeNominaActionTypes.SetPagoDeNominasFilter
    ),
    map(action => new fromActions.LoadPagoDeNominas())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType(PagoDeNominaActionTypes.LoadPagoDeNominas),
    switchMap(() => {
      return this.store.pipe(
        select(getPagoDeNominasFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(pagos => new fromActions.LoadPagoDeNominasSuccess({ pagos })),
        catchError(error =>
          of(new fromActions.PagoDeNominaError({ response: error }))
        )
      )
    )
  );

  @Effect()
  importar$ = this.actions$.pipe(
    ofType<fromActions.ImportarPagosDeNomina>(
      PagoDeNominaActionTypes.ImportarPagosDeNomina
    ),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.importar(pago).pipe(
        map(
          res => new fromActions.ImportarPagosDeNominaSuccess({ pagos: res })
        ),
        catchError(error =>
          of(new fromActions.PagoDeNominaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  pagar$ = this.actions$.pipe(
    ofType<fromActions.PagarNomina>(PagoDeNominaActionTypes.PagarNomina),
    map(action => action.payload.command),
    switchMap(pago => {
      return this.service.pagar(pago).pipe(
        map(res => new fromActions.PagarNominaSuccess({ pago: res })),
        catchError(error =>
          of(new fromActions.PagoDeNominaError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeletePagoDeNomina>(
      PagoDeNominaActionTypes.DeletePagoDeNomina
    ),
    map(action => action.payload.pago),
    switchMap(pago => {
      return this.service.delete(pago).pipe(
        map(res => new fromActions.DeletePagoDeNominaSuccess({ pago })),
        catchError(error =>
          of(new fromActions.PagoDeNominaError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<fromActions.ImportarPagosDeNominaSuccess>(
      PagoDeNominaActionTypes.ImportarPagosDeNominaSuccess
    ),
    map(action => action.payload.pagos),
    tap(pagos =>
      this.snackBar.open(
        `${pagos.length} pago(s) de nomina  importado(s) exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.PagoDeNominaError>(
      PagoDeNominaActionTypes.PagoDeNominaError
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
