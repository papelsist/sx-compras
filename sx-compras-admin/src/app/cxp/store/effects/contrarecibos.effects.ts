import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../actions/contrarecibos.actions';
import { ContrareciboActionTypes } from '../actions/contrarecibos.actions';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ContrareciboService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class ContrarecibosEffects {
  constructor(
    private actions$: Actions,
    private service: ContrareciboService,
    private store: Store<fromStore.CxpState>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadRecibos$ = this.actions$.pipe(
    ofType(ContrareciboActionTypes.LoadContrarecibos),
    switchMap(action => {
      return this.service
        .list()
        .pipe(
          map(res => new fromActions.LoadContrarecibosSuccess(res)),
          catchError(error => of(new fromActions.LoadContrarecibosFail(error)))
        );
    })
  );

  @Effect()
  addNota$ = this.actions$.pipe(
    ofType<fromActions.AddContrarecibo>(
      ContrareciboActionTypes.AddContrarecibo
    ),
    map(action => action.payload),
    switchMap(recibo => {
      return this.service
        .save(recibo)
        .pipe(
          map(res => new fromActions.AddContrareciboSuccess(res)),
          catchError(error => of(new fromActions.AddContrareciboFail(error)))
        );
    })
  );

  @Effect()
  updateRecibo$ = this.actions$.pipe(
    ofType<fromActions.UpdateContrarecibo>(
      ContrareciboActionTypes.UpdateContrarecibo
    ),
    map(action => action.payload),
    switchMap(recibo => {
      return this.service
        .update(recibo)
        .pipe(
          map(res => new fromActions.UpdateContrareciboSuccess(res)),
          catchError(error => of(new fromActions.UpdateContrareciboFail(error)))
        );
    })
  );

  @Effect()
  deleteRecibo$ = this.actions$.pipe(
    ofType<fromActions.DeleteContrarecibo>(
      ContrareciboActionTypes.DeleteContrarecibo
    ),
    map(action => action.payload),
    switchMap(recibo => {
      return this.service
        .delete(recibo.id.toString())
        .pipe(
          map(res => new fromActions.DeleteContrareciboSuccess(recibo)),
          catchError(error => of(new fromActions.DeleteContrareciboFail(error)))
        );
    })
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType(ContrareciboActionTypes.DeleteContrareciboSuccess),
    map(() => new fromRoot.Go({ path: ['cxp/contrarecibos'] }))
  );

  @Effect()
  updateSuccess$ = this.actions$.pipe(
    ofType<fromActions.UpdateContrareciboSuccess>(
      ContrareciboActionTypes.UpdateContrareciboSuccess,
      ContrareciboActionTypes.AddContrareciboSuccess
    ),
    map(action => action.payload),
    tap(recibo =>
      this.snackBar.open(`Contrarecibo ${recibo.id} actualizada `, 'Cerrar', {
        duration: 5000
      })
    ),
    map(recibo => new fromRoot.Go({ path: ['cxp/contrarecibos', recibo.id] }))
  );
}
