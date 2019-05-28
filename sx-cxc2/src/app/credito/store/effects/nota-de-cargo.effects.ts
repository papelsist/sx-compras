import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromRoot from 'app/store';
import * as fromActions from '../actions/nota-de-credito.actions';

import { NotaDeCreditoActionTypes } from '../actions/nota-de-credito.actions';
import { NotaDeCreditoService } from 'app/cobranza/services/nota-de-credito.service';

@Injectable()
export class NotaDeCreditoEffects {
  @Effect()
  loadNotas$ = this.actions$.pipe(
    ofType<fromActions.LoadNotasDeCargo>(
      NotaDeCreditoActionTypes.LoadNotasDeCargo
    ),
    map(action => action.payload),
    switchMap(payload =>
      this.service.list(payload.cartera.clave, payload.filter).pipe(
        map(notas => new fromActions.LoadNotasDeCargoSuccess({ notas })),
        catchError((response: any) =>
          of(new fromActions.LoadNotasDeCargoFail({ response }))
        )
      )
    )
  );

  @Effect()
  createNota$ = this.actions$.pipe(
    ofType<fromActions.CreateNotaDeCredito>(
      NotaDeCreditoActionTypes.CreateNotaDeCredito
    ),
    map(action => action.payload.nota),
    switchMap(nota =>
      this.service.save(nota).pipe(
        map(res => new fromActions.CreateNotaDeCreditoSuccess({ nota: res })),
        catchError(response =>
          of(new fromActions.CreateNotaDeCreditoFail({ response }))
        )
      )
    )
  );

  @Effect()
  updateNota$ = this.actions$.pipe(
    ofType<fromActions.UpdateNotaDeCredito>(
      NotaDeCreditoActionTypes.UpdateNotaDeCredito
    ),
    map(action => action.payload.update),
    switchMap(nota =>
      this.service.update(nota).pipe(
        map(res => new fromActions.UpdateNotaDeCreditoSuccess({ nota: res })),
        catchError(response =>
          of(new fromActions.UpdateNotaDeCreditoFail({ response }))
        )
      )
    )
  );

  @Effect()
  deleteNota$ = this.actions$.pipe(
    ofType<fromActions.DeleteNotaDeCredito>(
      NotaDeCreditoActionTypes.DeleteNotaDeCredito
    ),
    map(action => action.payload.nota),
    switchMap(nota =>
      this.service.delete(nota.id).pipe(
        map(res => new fromActions.DeleteNotaDeCreditoSuccess({ nota })),
        catchError(response =>
          of(new fromActions.DeleteNotaDeCreditoFail({ response }))
        )
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadNotasDeCargoFail
      | fromActions.CreateNotaDeCreditoFail
      | fromActions.UpdateNotaDeCreditoFail
      | fromActions.DeleteNotaDeCreditoFail
    >(
      NotaDeCreditoActionTypes.LoadNotasDeCargoFail,
      NotaDeCreditoActionTypes.CreateNotaDeCreditoFail,
      NotaDeCreditoActionTypes.UpdateNotaDeCreditoFail,
      NotaDeCreditoActionTypes.DeleteNotaDeCreditoFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );

  constructor(
    private actions$: Actions<fromActions.NotaDeCreditoActions>,
    private service: NotaDeCreditoService
  ) {}
}
