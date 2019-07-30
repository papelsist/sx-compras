import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './reducer';
import { selectPeriodo } from './selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { CambioDePreciosActionTypes } from './actions';
import * as fromActions from './actions';

import { CambiosDePrecioService } from '../services/cambios-de-precio.service';

@Injectable()
export class CambiosDePrecioEffects {
  constructor(
    private actions$: Actions,
    private service: CambiosDePrecioService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(CambioDePreciosActionTypes.LoadCambiosDePrecio),
    switchMap(() => {
      return this.store.pipe(
        select(selectPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(
          cambios =>
            new fromActions.LoadCambiosDePrecioSuccess({
              cambios
            })
        ),
        catchError(response =>
          of(new fromActions.LoadCambiosDePrecioFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateCambioDePrecio>(
      CambioDePreciosActionTypes.CreateCambioDePrecio
    ),
    map(action => action.payload.cambio),
    switchMap(req => {
      return this.service.save(req).pipe(
        map(
          cambio =>
            new fromActions.CreateCambioDePrecioSuccess({
              cambio
            })
        ),
        catchError(response =>
          of(new fromActions.CreateCambioDePrecioFail({ response }))
        )
      );
    })
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreateCambioDePrecioSuccess>(
      CambioDePreciosActionTypes.CreateCambioDePrecioSuccess
    ),
    map(action => action.payload.cambio),
    map(r => new fromRoot.Go({ path: ['/cambios-de-precio', r.id] }))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateCambioDePrecio>(
      CambioDePreciosActionTypes.UpdateCambioDePrecio
    ),
    map(action => action.payload.update),
    switchMap(upd => {
      return this.service.update(upd).pipe(
        map(
          cambio =>
            new fromActions.UpdateCambioDePrecioSuccess({
              cambio
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateCambioDePrecioFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteCambioDePrecio>(
      CambioDePreciosActionTypes.DeleteCambioDePrecio
    ),
    map(action => action.payload.cambio),
    switchMap(cambio => {
      return this.service.delete(cambio.id).pipe(
        map(
          () =>
            new fromActions.DeleteCambioDePrecioSuccess({
              cambio
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteCambioDePrecioFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteCambioDePrecioSuccess>(
      CambioDePreciosActionTypes.DeleteCambioDePrecioSuccess
    ),
    map(action => action.payload.cambio),
    map(r => new fromRoot.Go({ path: ['cambios-de-precio'] }))
  );

  @Effect()
  aplicar$ = this.actions$.pipe(
    ofType<fromActions.AplicarCambioDePrecios>(
      CambioDePreciosActionTypes.AplicarCambioDePrecios
    ),
    map(action => action.payload.cambio),
    switchMap(cambio => {
      return this.service.aplicar(cambio.id).pipe(
        map(
          res =>
            new fromActions.AplicarCambioDePreciosSuccess({
              cambio: res
            })
        ),
        catchError(response =>
          of(new fromActions.AplicarCambioDePreciosFail({ response }))
        )
      );
    })
  );

  @Effect()
  aplicarSuccess$ = this.actions$.pipe(
    ofType<fromActions.AplicarCambioDePreciosSuccess>(
      CambioDePreciosActionTypes.AplicarCambioDePreciosSuccess
    ),
    map(action => action.payload.cambio),
    map(c => new fromRoot.Go({ path: ['ordenes/compras', c.id] }))
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadCambiosDePrecioFail
      | fromActions.CreateCambioDePrecioFail
      | fromActions.UpdateCambioDePrecioFail
      | fromActions.DeleteCambioDePrecioFail
      | fromActions.AplicarCambioDePreciosFail
    >(
      CambioDePreciosActionTypes.LoadCambiosDePrecioFail,
      CambioDePreciosActionTypes.CreateCambioDePrecioFail,
      CambioDePreciosActionTypes.UpdateCambioDePrecioFail,
      CambioDePreciosActionTypes.DeleteCambioDePrecioFail,
      CambioDePreciosActionTypes.AplicarCambioDePreciosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
