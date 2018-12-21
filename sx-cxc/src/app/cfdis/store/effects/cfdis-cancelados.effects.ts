import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getCfdisCanceladosFilter } from '../../store/selectors/cancelados.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CfdiCanceladoActionTypes } from '../actions/cancelados.actions';
import * as fromActions from '../actions/cancelados.actions';
import { CfdisCanceladosService } from '../../services';

import { MatSnackBar } from '@angular/material';
import { ReportService } from '../../../reportes/services/report.service';

@Injectable()
export class CfdisCanceladosEffects {
  constructor(
    private actions$: Actions,
    private service: CfdisCanceladosService,
    private store: Store<fromStore.State>,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadCfdis$ = this.actions$.pipe(
    ofType(CfdiCanceladoActionTypes.LoadCfdisCancelados),
    switchMap(() => {
      return this.store.pipe(
        select(getCfdisCanceladosFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(
          res => new fromActions.LoadCfdisCanceladosSuccess({ cancelados: res })
        ),
        catchError(error => of(new fromActions.LoadCfdisCanceladosFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  mostrarAcuse$ = this.actions$.pipe(
    ofType<fromActions.MostrarAcuseDeCancelacion>(
      CfdiCanceladoActionTypes.MostrarAcuseDeCancelacion
    ),
    map(action => action.payload.cancelacion),
    tap(cancelacion => this.service.mostrarAcuse(cancelacion))
  );

  @Effect()
  getFail$ = this.actions$.pipe(
    ofType<fromActions.LoadCfdisCanceladosFail>(
      CfdiCanceladoActionTypes.LoadCfdisCanceladosFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
