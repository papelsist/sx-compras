import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromRoot from 'app/store';
import * as fromActions from '../actions/nota-de-cargo.actions';

import { NotaDeCargoActionTypes } from '../actions/nota-de-cargo.actions';
import { NotaDeCargoService } from 'app/cobranza/services/nota-de-cargo.service';

@Injectable()
export class NotaDeCargoEffects {
  @Effect()
  loadNotas$ = this.actions$.pipe(
    ofType<fromActions.LoadNotasDeCargo>(
      NotaDeCargoActionTypes.LoadNotasDeCargo
    ),
    map(action => action.payload),
    switchMap(payload =>
      this.service.list(payload.cartera, payload.filter).pipe(
        map(notas => new fromActions.LoadNotasDeCargoSuccess({ notas })),
        catchError((response: any) =>
          of(new fromActions.LoadNotasDeCargoFail({ response }))
        )
      )
    )
  );

  @Effect()
  createNota$ = this.actions$.pipe(
    ofType<fromActions.CreateNotaDeCargo>(
      NotaDeCargoActionTypes.CreateNotaDeCargo
    ),
    map(action => action.payload.nota),
    switchMap(nota =>
      this.service.save(nota).pipe(
        map(res => new fromActions.CreateNotaDeCargoSuccess({ nota: res })),
        catchError(response =>
          of(new fromActions.CreateNotaDeCargoFail({ response }))
        )
      )
    )
  );

  @Effect()
  updateNota$ = this.actions$.pipe(
    ofType<fromActions.UpdateNotaDeCargo>(
      NotaDeCargoActionTypes.UpdateNotaDeCargo
    ),
    map(action => action.payload.update),
    switchMap(nota =>
      this.service.update(nota).pipe(
        map(res => new fromActions.UpdateNotaDeCargoSuccess({ nota: res })),
        catchError(response =>
          of(new fromActions.UpdateNotaDeCargoFail({ response }))
        )
      )
    )
  );

  @Effect()
  deleteNota$ = this.actions$.pipe(
    ofType<fromActions.DeleteNotaDeCargo>(
      NotaDeCargoActionTypes.DeleteNotaDeCargo
    ),
    map(action => action.payload.nota),
    switchMap(nota =>
      this.service.delete(nota.id).pipe(
        map(res => new fromActions.DeleteNotaDeCargoSuccess({ nota })),
        catchError(response =>
          of(new fromActions.DeleteNotaDeCargoFail({ response }))
        )
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadNotasDeCargoFail
      | fromActions.CreateNotaDeCargoFail
      | fromActions.UpdateNotaDeCargoFail
      | fromActions.DeleteNotaDeCargoFail
    >(
      NotaDeCargoActionTypes.LoadNotasDeCargoFail,
      NotaDeCargoActionTypes.CreateNotaDeCargoFail,
      NotaDeCargoActionTypes.UpdateNotaDeCargoFail,
      NotaDeCargoActionTypes.DeleteNotaDeCargoFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );

  constructor(
    private actions$: Actions<fromActions.NotaDeCargoActions>,
    private service: NotaDeCargoService
  ) {}
}
