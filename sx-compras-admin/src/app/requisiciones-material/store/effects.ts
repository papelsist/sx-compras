import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from './reducer';
import { selectPeriodo } from './selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, take, tap } from 'rxjs/operators';

import { RequisicionesDeMaterialActionTypes } from './actions';
import * as fromActions from './actions';

import { RequisicionDeMaterialService } from '../services/requisicion-de-material.service';

@Injectable()
export class RequisicionDeMaterialEffects {
  constructor(
    private actions$: Actions,
    private service: RequisicionDeMaterialService,
    private store: Store<fromStore.State>
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(RequisicionesDeMaterialActionTypes.LoadRequisiciones),
    switchMap(() => {
      return this.store.pipe(
        select(selectPeriodo),
        take(1)
      );
    }),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(
          requisiciones =>
            new fromActions.LoadRequisicionesDeMaterialSuccess({
              requisiciones
            })
        ),
        catchError(response =>
          of(new fromActions.LoadRequisicionesDeMaterialFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateRequisicionDeMaterial>(
      RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterial
    ),
    map(action => action.payload.requisicion),
    switchMap(req => {
      return this.service.save(req).pipe(
        map(
          requisicion =>
            new fromActions.CreateRequisicionDeMaterialSuccess({
              requisicion
            })
        ),
        catchError(response =>
          of(new fromActions.CreateRequisicionDeMaterialFail({ response }))
        )
      );
    })
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreateRequisicionDeMaterialSuccess>(
      RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialSuccess
    ),
    map(action => action.payload.requisicion),
    map(r => new fromRoot.Go({ path: ['/ordenes/requisiciones', r.id] }))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateRequisicionDeMaterial>(
      RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterial
    ),
    map(action => action.payload.update),
    switchMap(upd => {
      return this.service.update(upd).pipe(
        map(
          requisicion =>
            new fromActions.UpdateRequisicionDeMaterialSuccess({
              requisicion
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateRequisicionDeMaterialFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteRequisicionDeMaterial>(
      RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterial
    ),
    map(action => action.payload.requisicion),
    switchMap(requisicion => {
      return this.service.delete(requisicion.id).pipe(
        map(
          () =>
            new fromActions.DeleteRequisicionDeMaterialSuccess({
              requisicion
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteRequisicionDeMaterialFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteRequisicionDeMaterialSuccess>(
      RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialSuccess
    ),
    map(action => action.payload.requisicion),
    map(r => new fromRoot.Go({ path: ['ordenes/requisiciones'] }))
  );

  @Effect()
  generarCompra$ = this.actions$.pipe(
    ofType<fromActions.GenerarCompraDeMaterial>(
      RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterial
    ),
    map(action => action.payload.requisicion),
    switchMap(requisicion => {
      return this.service.generarCompra(requisicion.id).pipe(
        map(
          res =>
            new fromActions.GenerarCompraDeMaterialSuccess({
              requisicion: res
            })
        ),
        catchError(response =>
          of(new fromActions.GenerarCompraDeMaterialFail({ response }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  generarCompraSuccess$ = this.actions$.pipe(
    ofType<fromActions.GenerarCompraDeMaterialSuccess>(
      RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialSuccess
    ),
    map(action => action.payload.requisicion),
    tap(req => console.log('Compra genrada de req: ', req))
    // map(r => new fromRoot.Go({ path: ['ordenes/requisiciones'] }))
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadRequisicionesDeMaterialFail
      | fromActions.CreateRequisicionDeMaterialFail
      | fromActions.UpdateRequisicionDeMaterialFail
      | fromActions.DeleteRequisicionDeMaterialFail
      | fromActions.GenerarCompraDeMaterialFail
    >(
      RequisicionesDeMaterialActionTypes.LoadRequisicionesFail,
      RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialFail,
      RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterialFail,
      RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialFail,
      RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
