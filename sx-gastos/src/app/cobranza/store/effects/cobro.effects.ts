import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { CobroActionTypes } from '../actions/cobro.actions';
import * as fromActions from '../actions/cobro.actions';

import { CobroService } from '../../services/cobro.service';

@Injectable()
export class CobroEffects {
  constructor(private actions$: Actions, private service: CobroService) {}

  @Effect()
  loadCobros$ = this.actions$.pipe(
    ofType<fromActions.LoadCobros>(CobroActionTypes.LoadCobros),
    map(action => action.payload),
    switchMap(payload =>
      this.service.list(payload.cartera.clave, payload.filter).pipe(
        map(cobros => new fromActions.LoadCobrosSuccess({ cobros })),
        catchError(error =>
          of(new fromActions.LoadCobrosFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  aplicarCobro$ = this.actions$.pipe(
    ofType<fromActions.RegistrarAplicaciones>(
      CobroActionTypes.RegistrarAplicaciones
    ),
    map(action => action.payload),
    switchMap(command => {
      return this.service
        .registrarAcplicaciones(command.cobroId, command.facturas)
        .pipe(
          map(cobro => new fromActions.RegistrarAplicacionesSuccess({ cobro })),
          catchError(error =>
            of(new fromActions.RegistrarAplicacionesFail({ response: error }))
          )
        );
    })
  );

  @Effect()
  eliminarAplicacion$ = this.actions$.pipe(
    ofType<fromActions.EliminarAplicacion>(CobroActionTypes.EliminarAplicacion),
    map(action => action.payload),
    switchMap(command => {
      return this.service.eliminarAcplicacion(command.aplicationId).pipe(
        map(cobro => new fromActions.EliminarAplicacionSuccess({ cobro })),
        catchError(error =>
          of(new fromActions.EliminarAplicacionFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadCobrosFail
      | fromActions.RegistrarAplicacionesFail
      | fromActions.EliminarAplicacionFail
    >(
      CobroActionTypes.LoadCobrosFail,
      CobroActionTypes.RegistrarAplicacionesFail,
      CobroActionTypes.EliminarAplicacionFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
