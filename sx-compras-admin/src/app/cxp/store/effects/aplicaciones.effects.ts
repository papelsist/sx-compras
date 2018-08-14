import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../actions/aplicaciones.actions';
import * as fromNotas from '../actions/notas.actions';
import { AplicacionesActionTypes } from '../actions/aplicaciones.actions';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ContrareciboService, AplicacionDePagoService } from '../../services';

import { MatSnackBar } from '@angular/material';
import { NotaDeCreditoCxP } from '../../model';

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
    ofType<fromActions.DeleteAplicacionDeNota>(
      AplicacionesActionTypes.DeleteAplicacionDeNota
    ),
    map(action => action.payload),
    switchMap(aplicacion => {
      return this.service
        .delete(aplicacion.id.toString())
        .pipe(
          map(
            (res: NotaDeCreditoCxP) =>
              new fromActions.DeleteAplicacionDeNotaSuccess(res)
          ),
          catchError(error =>
            of(new fromActions.DeleteAplicacionDeNotaFail(error))
          )
        );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteAplicacionDeNotaSuccess>(
      AplicacionesActionTypes.DeleteAplicacionDeNotaSuccess
    ),
    map( action => action.payload),
    tap(res => console.log('Nota after effect: ', res)),
    map(res => new fromNotas.UpsertNota({nota: res}))
  );

  @Effect({ dispatch: false })
  $deleteAplicacionFail = this.actions$.pipe(
    ofType<fromActions.DeleteAplicacionDeNotaFail>(
      AplicacionesActionTypes.DeleteAplicacionDeNotaFail
    ),
    map(action => action.payload),
    tap(error => console.log('Error: ', error)),
    tap(error =>
      this.snackBar.open(`Error en el servidor `, 'Cerrar', {
        duration: 5000
      })
    )
  );
}