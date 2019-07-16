import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromRequisicion from '../actions/requisicion.actions';
import { getPeriodoDeRequisiciones } from '../selectors/requisiciones.selectors';

import { map, switchMap, catchError, tap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  RequisicionActionTypes,
  SaveRequisicion
} from '../actions/requisicion.actions';

import * as fromServices from '../../services';

import { MatSnackBar } from '@angular/material';
import { Periodo } from 'app/_core/models/periodo';
import { RequisicionesPeriodoStoeKey } from '../reducers/requisicion.reducer';

@Injectable()
export class RequisicionesEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.RequisicionDeCompraService,
    public snackBar: MatSnackBar,
    private store: Store<fromStore.CxpState>
  ) {}

  @Effect()
  loadRequisiciones$ = this.actions$.pipe(
    ofType<fromRequisicion.LoadRequisiciones>(
      RequisicionActionTypes.LoadRequisiciones
    ),
    switchMap(() => {
      return this.store.pipe(select(getPeriodoDeRequisiciones));
    }),
    switchMap(periodo =>
      this.service.list(periodo).pipe(
        map(
          requisiciones =>
            new fromRequisicion.LoadRequisicionesSuccess({ requisiciones })
        ),
        catchError(error =>
          of(new fromRequisicion.LoadRequisicionesFail(error))
        )
      )
    )
  );

  @Effect()
  periodo$ = this.actions$.pipe(
    ofType<fromRequisicion.SetRequisicionPeriodo>(
      RequisicionActionTypes.SetRequisicionPeriodo
    ),
    map(action => action.payload.periodo),
    tap(periodo => Periodo.saveOnStorage(RequisicionesPeriodoStoeKey, periodo)),
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
    ofType<
      | fromRequisicion.UpdateRequisicionFail
      | fromRequisicion.SaveRequisicionFail
      | fromRequisicion.CerrarRequisicionFail
    >(
      RequisicionActionTypes.UPDATE_REQUISICION_FAIL,
      RequisicionActionTypes.SAVE_REQUISICION_FAIL,
      RequisicionActionTypes.CERRAR_REQUISICION_FAIL
    ),
    map(action => action.payload),
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

  @Effect({ dispatch: false })
  errorHandler2$ = this.actions$.pipe(
    ofType<fromRequisicion.LoadRequisicionesFail>(
      RequisicionActionTypes.LoadRequisicionesFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
