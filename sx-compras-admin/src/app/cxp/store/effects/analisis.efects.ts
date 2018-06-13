import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as analisisActions from '../actions/analisis.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

@Injectable()
export class AnalisisEffects {
  constructor(
    private actions$: Actions,
    private comprobantesService: fromServices.ComprobanteFiscalService
  ) {}

  @Effect()
  setCurrentProveedor$ = this.actions$.pipe(
    ofType<analisisActions.SetCurrentProveedor>(
      analisisActions.AnalisisActionTypes.SET_CURRENT_PROVEEDOR
    ),
    map(action => action.payload),
    switchMap(proveedor => {
      return this.comprobantesService
        .pendientesDeAnalizar(proveedor.id)
        .pipe(
          map(
            facturas =>
              new analisisActions.LoadFacturasPendientesSuccess(facturas)
          ),
          catchError(error =>
            of(new analisisActions.LoadFacturasPendientesFail(error))
          )
        );
    })
  );
}
