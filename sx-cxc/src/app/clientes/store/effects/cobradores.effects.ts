import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromCobradores from '../actions/cobrador.actions';
import { CobradorActionTypes } from '../actions/cobrador.actions';

import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class CobradoresEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.CobradorService,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType<fromCobradores.LoadCobradores>(CobradorActionTypes.LoadCobradores),
    switchMap(() => {
      return this.service.list().pipe(
        map(
          cobradores => new fromCobradores.LoadCobradoresSuccess({ cobradores })
        ),
        catchError(response =>
          of(new fromCobradores.LoadCobradoresFail({ response }))
        )
      );
    })
  );

  @Effect()
  save$ = this.actions$.pipe(
    ofType<fromCobradores.CreateCobrador>(CobradorActionTypes.CreateCobrador),
    map(action => action.payload.cobrador),
    switchMap(cobrador => {
      return this.service.save(cobrador).pipe(
        map(res => new fromCobradores.CreateCobradorSuccess({ cobrador: res })),
        catchError(response =>
          of(new fromCobradores.CreateCobradorFail({ response }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromCobradores.UpdateCobrador>(CobradorActionTypes.UpdateCobrador),
    map(action => action.payload.cobrador),
    switchMap(cobrador => {
      return this.service.update(cobrador).pipe(
        map(res => new fromCobradores.UpdateCobradorSuccess({ cobrador: res })),
        catchError(response =>
          of(new fromCobradores.UpdateCobradorFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromCobradores.DeleteCobrador>(CobradorActionTypes.DeleteCobrador),
    map(action => action.payload.cobrador),
    switchMap(cobrador => {
      return this.service.delete(cobrador).pipe(
        map(res => new fromCobradores.DeleteCobradorSuccess({ cobrador: res })),
        catchError(response =>
          of(new fromCobradores.DeleteCobradorFail({ response }))
        )
      );
    })
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromCobradores.CreateCobradorSuccess>(
      CobradorActionTypes.CreateCobradorSuccess
    ),
    map(action => action.payload.cobrador),
    map(res => new fromRoot.Go({ path: ['/cobradores', res.id] }))
  );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<fromCobradores.UpdateCobradorSuccess>(
      CobradorActionTypes.UpdateCobradorSuccess
    ),
    map(action => action.payload.cobrador),
    tap(cobrador =>
      this.snackBar.open(`Cobrador ${cobrador.nombres} actualizado`, 'Cerrar', {
        duration: 8000
      })
    )
  );

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromCobradores.DeleteCobradorSuccess>(
      CobradorActionTypes.DeleteCobradorSuccess
    ),
    map(action => action.payload.cobrador),
    tap(cobrador =>
      this.snackBar.open(`Cobrador ${cobrador.nombres} eliminado`, 'Cerrar', {
        duration: 8000
      })
    )
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromCobradores.LoadCobradoresFail
      | fromCobradores.CreateCobradorFail
      | fromCobradores.UpdateCobradorFail
    >(
      CobradorActionTypes.LoadCobradoresFail,
      CobradorActionTypes.CreateCobradorFail,
      CobradorActionTypes.UpdateCobradorFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
