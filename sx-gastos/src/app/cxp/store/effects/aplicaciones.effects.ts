import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromActions from '../actions/aplicaciones.actions';
import * as fromNotas from '../actions/notas.actions';
import { AplicacionesActionTypes } from '../actions/aplicaciones.actions';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { AplicacionDePagoService } from '../../services';

import { MatSnackBar } from '@angular/material';
import { NotaDeCreditoCxP } from '../../model';

@Injectable()
export class AplicacionesEffects {
  constructor(
    private actions$: Actions,
    private service: AplicacionDePagoService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  addAplicacionNota$ = this.actions$.pipe(
    ofType<fromActions.AddAplicacionNota>(
      AplicacionesActionTypes.AddAplicacionNota
    ),
    map(action => action.payload),
    switchMap(aplicacion =>
      this.service.save(aplicacion).pipe(
        // tap(nota => console.log('Aplicacion actualizada en API: ', nota)),
        map(
          (res: NotaDeCreditoCxP) =>
            new fromActions.AddAplicacionNotaSuccess(res)
        ),
        catchError(error => of(new fromActions.AddAplicacionNotaFail(error)))
      )
    )
  );

  @Effect()
  addAplicacionSuccess$ = this.actions$.pipe(
    ofType<fromActions.AddAplicacionNotaSuccess>(
      AplicacionesActionTypes.AddAplicacionNotaSuccess
    ),
    map(action => action.payload),
    // tap(nota => console.log('Nota after effect: ', nota)),
    map(nota => new fromNotas.UpsertNota({ nota }))
  );

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
    map(action => action.payload),
    // tap(res => console.log('Nota after effect: ', res)),
    map(res => new fromNotas.UpsertNota({ nota: res }))
  );

  @Effect({ dispatch: false })
  $deleteAplicacionFail = this.actions$.pipe(
    ofType<
      fromActions.DeleteAplicacionDeNotaFail | fromActions.AddAplicacionNotaFail
    >(
      AplicacionesActionTypes.DeleteAplicacionDeNotaFail,
      AplicacionesActionTypes.AddAplicacionNotaFail
    ),
    map(action => action.payload),
    tap(response => {
      console.error('AplicacionDeNota error: ', response.error);
      const msg =
        response.status === 500
          ? 'Error en el servidor (500)'
          : response.status;
      this.snackBar.open(`${msg} `, 'Cerrar', {
        duration: 10000,
        verticalPosition: 'top',
        politeness: 'assertive'
      });
    })
  );
}
