import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../actions/aplicaciones.actions';
import { AplicacionDePagoActionTypes } from '../actions/aplicaciones.actions';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ContrareciboService, AplicacionDePagoService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class AplicacionesEffects {
  constructor(
    private actions$: Actions,
    private service: AplicacionDePagoService,
    private store: Store<fromStore.CxpState>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  deleteAplicacionDeNota$ = this.actions$.pipe(
    ofType<fromActions.DeleteAplicacionDePago>(
      AplicacionDePagoActionTypes.DeleteAplicacionDePago
    ),
    map(action => action.payload),
    switchMap(aplicacion => {
      return this.service
        .delete(aplicacion.id.toString())
        .pipe(
          map(res => new fromActions.DeleteAplicacionDePagoSuccess(res)),
          catchError(error =>
            of(new fromActions.DeleteAplicacionDePagoFail(error))
          )
        );
    })
  );

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteAplicacionDePagoSuccess>(
      AplicacionDePagoActionTypes.DeleteAplicacionDePagoSuccess
    ),
    tap(action => console.log('Res de aplicacion: ', action.payload)),
    map((action: any) => {
      if (action.payload.tipo === 'NOTA') {
        console.log('Letsgo to nota ', action.payload);
        // return new fromRoot.Go({ path: ['cxp/notas', action.payload.id] });
      } else {
        console.log('Letsgo to PAGO ', action.payload);
        // return new fromRoot.Go({ path: ['cxp/pagos', action.payload.id] });
      }
    })
  );
}
