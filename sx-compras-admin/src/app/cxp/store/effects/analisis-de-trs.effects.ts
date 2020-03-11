import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromRoot from 'app/store';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { AnalisisDeTrsActionTypes } from '../actions/analisis-de-transformacion.actions';
import * as fromActions from '../actions/analisis-de-transformacion.actions';
import { AnalisisDeTrsService } from 'app/cxp/services/analisis-de-trs.service';

@Injectable()
export class AnalisisDeTrsEffects {
  constructor(
    private actions$: Actions,
    private service: AnalisisDeTrsService
  ) {}

  @Effect()
  loadAnalisis$ = this.actions$.pipe(
    ofType<fromActions.LoadAnalisisDeTransformaciones>(
      AnalisisDeTrsActionTypes.LoadAnalisisDeTransformaciones
    ),
    map(action => action.payload.periodo),
    switchMap(periodo => {
      return this.service.list(periodo).pipe(
        map(
          rows =>
            new fromActions.LoadAnalisisDeTransformacionesSuccess({
              rows
            })
        ),
        catchError(response =>
          of(new fromActions.LoadAnalisisDeTransformacionesFail({ response }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateAnalisisDeTransformacion>(
      AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacion
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.save(payload.analisis).pipe(
        map(
          analisis =>
            new fromActions.CreateAnalisisDeTransformacionSuccess({
              analisis
            })
        ),
        catchError(response =>
          of(new fromActions.CreateAnalisisDeTransformacionFail({ response }))
        )
      );
    })
  );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<fromActions.CreateAnalisisDeTransformacionSuccess>(
      AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionSuccess
    ),
    map(
      action =>
        new fromRoot.Go({
          path: ['cxp/analisisDeTrs', action.payload.analisis.id]
        })
    )
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateAnalisisDeTransformacion>(
      AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacion
    ),
    map(action => action.payload),
    switchMap(upd => {
      return this.service.update(upd.analisis).pipe(
        map(
          analisis =>
            new fromActions.UpdateAnalisisDeTransformacionSuccess({
              analisis
            })
        ),
        catchError(response =>
          of(new fromActions.UpdateAnalisisDeTransformacionFail({ response }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteAnalisisDeTransformacion>(
      AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacion
    ),
    map(action => action.payload.id),
    switchMap(id => {
      return this.service.delete(id).pipe(
        map(
          () =>
            new fromActions.DeleteAnalisisDeTransformacionSuccess({
              analisisId: id
            })
        ),
        catchError(response =>
          of(new fromActions.DeleteAnalisisDeTransformacionFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<fromActions.DeleteAnalisisDeTransformacionSuccess>(
      AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionSuccess
    ),
    map(() => new fromRoot.Go({ path: ['cxp/analisisDeTrs'] }))
  );

  @Effect()
  consolidar$ = this.actions$.pipe(
    ofType<fromActions.ConsolidarCostos>(
      AnalisisDeTrsActionTypes.ConsolidarCostos
    ),
    map(action => action.payload.periodo),
    switchMap(periodo => {
      return this.service.consolidar(periodo).pipe(
        map(
          response =>
            new fromActions.ConsolidarCostosSuccess({
              response
            })
        ),
        catchError(response =>
          of(new fromActions.ConsolidarCostosFail({ response }))
        )
      );
    })
  );

  @Effect()
  errorHandler$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadAnalisisDeTransformacionesFail
      | fromActions.CreateAnalisisDeTransformacionFail
      | fromActions.DeleteAnalisisDeTransformacionFail
      | fromActions.UpdateAnalisisDeTransformacionFail
      | fromActions.ConsolidarCostosFail
    >(
      AnalisisDeTrsActionTypes.LoadAnalisisDeTransformacionesFail,
      AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionFail,
      AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacionFail,
      AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionFail,
      AnalisisDeTrsActionTypes.ConsolidarCostosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
