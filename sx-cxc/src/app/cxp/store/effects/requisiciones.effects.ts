import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { getRequisicionesFilter } from '../../store/selectors/requisiciones.selectors';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromRequisicion from '../actions/requisicion.actions';
import {
  RequisicionActionTypes,
  SaveRequisicion
} from '../actions/requisicion.actions';

import * as fromServices from '../../services';
import * as fromRoot from 'app/store';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class RequisicionesEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.RequisicionesService,
    private store: Store<fromStore.State>,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  load$ = this.actions$.pipe(
    ofType(RequisicionActionTypes.LoadRequisciones),
    switchMap(() => {
      return this.store.pipe(
        select(getRequisicionesFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(
          requisiciones =>
            new fromRequisicion.LoadRequisicionesSuccess({ requisiciones })
        ),
        catchError(response =>
          of(new fromRequisicion.LoadRequisicionesFail({ response }))
        )
      );
    })
  );

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromRequisicion.SetRequisicionesFilter>(
      RequisicionActionTypes.SetRequisicionesFilter
    ),
    map(() => new fromRequisicion.LoadRequisiciones())
  );

  @Effect()
  save$ = this.actions$.pipe(
    ofType<SaveRequisicion>(RequisicionActionTypes.SAVE_REQUISICION),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service.save(requisicion).pipe(
        map(res => new fromRequisicion.SaveRequisicionSuccess(res)),
        catchError(error => of(new fromRequisicion.SaveRequisicionFail(error)))
      );
    })
  );

  @Effect()
  saveSuccess$ = this.actions$.pipe(
    ofType<fromRequisicion.SaveRequisicionSuccess>(
      RequisicionActionTypes.SAVE_REQUISICION_SUCCESS
    ),
    map(action => action.payload),
    map(res => new fromRoot.Go({ path: ['cxp/requisiciones', res.id] }))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromRequisicion.UpdateRequisicion>(
      RequisicionActionTypes.UPDATE_REQUISICION
    ),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service.update(requisicion).pipe(
        map(res => new fromRequisicion.UpdateRequisicionSuccess(res)),
        catchError(error =>
          of(new fromRequisicion.UpdateRequisicionFail(error))
        )
      );
    })
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromRequisicion.UpdateRequisicionSuccess>(
      RequisicionActionTypes.UPDATE_REQUISICION_SUCCESS,
      RequisicionActionTypes.CERRAR_REQUISICION_SUCCESS
    ),
    map(action => action.payload),
    tap(requisicion =>
      this.snackBar.open(
        `Requisición ${requisicion.folio} actualizada `,
        'Cerrar',
        {
          duration: 2000
        }
      )
    ),
    map(res => new fromRoot.Go({ path: ['cxp/requisiciones', res.id] }))
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromRequisicion.DeleteRequisicion>(
      RequisicionActionTypes.DELETE_REQUISICION
    ),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service.delete(requisicion.id).pipe(
        map(res => new fromRequisicion.DeleteRequisicionSuccess(requisicion)),
        catchError(error =>
          of(new fromRequisicion.DeleteRequisicionFail(error))
        )
      );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(RequisicionActionTypes.DELETE_REQUISICION_SUCCESS),
    map(() => new fromRoot.Go({ path: ['cxp/requisiciones'] }))
  );

  @Effect()
  cerrar$ = this.actions$.pipe(
    ofType<fromRequisicion.CerrarRequisicion>(
      RequisicionActionTypes.CERRAR_REQUISICION
    ),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service.cerrar(requisicion).pipe(
        map(res => new fromRequisicion.CerrarRequisicionSuccess(res)),
        catchError(error =>
          of(new fromRequisicion.CerrarRequisicionFail(error))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  errorHandler$ = this.actions$.pipe(
    ofType(
      RequisicionActionTypes.UPDATE_REQUISICION_FAIL,
      RequisicionActionTypes.SAVE_REQUISICION_FAIL,
      RequisicionActionTypes.CERRAR_REQUISICION_FAIL,
      RequisicionActionTypes.LoadRequiscionesFail
    ),
    map((action: any) => {
      const error = action.payload;
      this.snackBar.open(
        `Error: ${error.status}: ${error.statusText}`,
        'Cerrar',
        {
          duration: 8000
        }
      );
    })
  );
}
