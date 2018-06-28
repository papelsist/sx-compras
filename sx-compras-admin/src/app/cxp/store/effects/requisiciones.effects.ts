import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
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
    private service: fromServices.RequisicionDeCompraService,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  save$ = this.actions$.pipe(
    ofType<SaveRequisicion>(RequisicionActionTypes.SAVE_REQUISICION),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service
        .save(requisicion)
        .pipe(
          map(res => new fromRequisicion.SaveRequisicionSuccess(res)),
          catchError(error =>
            of(new fromRequisicion.SaveRequisicionFail(error))
          )
        );
    })
  );

  @Effect()
  saveSuccess$ = this.actions$.pipe(
    ofType<fromRequisicion.SaveRequisicionSuccess>(
      RequisicionActionTypes.SAVE_REQUISICION_SUCCESS
    ),
    map(action => action.payload),
    map(() => new fromRoot.Go({ path: ['cxp/requisiciones'] }))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromRequisicion.UpdateRequisicion>(
      RequisicionActionTypes.UPDATE_REQUISICION
    ),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service
        .update(requisicion)
        .pipe(
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
      RequisicionActionTypes.UPDATE_REQUISICION_SUCCESS
    ),
    map(action => action.payload),
    map(() => new fromRoot.Go({ path: ['cxp/requisiciones'] }))
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromRequisicion.DeleteRequisicion>(
      RequisicionActionTypes.DELETE_REQUISICION
    ),
    map(action => action.payload),
    switchMap(requisicion => {
      return this.service
        .delete(requisicion.id)
        .pipe(
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

  @Effect({ dispatch: false })
  errorHandler$ = this.actions$.pipe(
    ofType(
      RequisicionActionTypes.UPDATE_REQUISICION_FAIL,
      RequisicionActionTypes.SAVE_REQUISICION_FAIL
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
