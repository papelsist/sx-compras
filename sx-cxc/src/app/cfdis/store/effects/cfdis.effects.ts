import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { getCfdisFilter } from '../../store/selectors/cfdis.selectors';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CfdiActionTypes } from '../actions/cfdis.actions';
import * as fromActions from '../actions/cfdis.actions';
import { CfdisService } from '../../services';

import { MatSnackBar } from '@angular/material';
import { ReportService } from '../../../reportes/services/report.service';

@Injectable()
export class CfdisEffects {
  constructor(
    private actions$: Actions,
    private service: CfdisService,
    private store: Store<fromStore.State>,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadCfdis$ = this.actions$.pipe(
    ofType(CfdiActionTypes.LoadCfdis),
    switchMap(() => {
      return this.store.pipe(
        select(getCfdisFilter),
        take(1)
      );
    }),
    switchMap(filter => {
      return this.service.list(filter).pipe(
        map(res => new fromActions.LoadCfdisSuccess({ cfdis: res })),
        catchError(error => of(new fromActions.LoadCfdisFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  imprimirCfdi$ = this.actions$.pipe(
    ofType<fromActions.ImprimirCfdi>(CfdiActionTypes.ImprimirCfdi),
    map(action => action.payload),
    tap(cfdi => this.reportService.runReport(`cfdi/pdf/${cfdi}`))
  );

  @Effect({ dispatch: false })
  xmlCfdi$ = this.actions$.pipe(
    ofType<fromActions.MostrarXmlCfdi>(CfdiActionTypes.MostrarXmlDelCfdi),
    map(action => action.payload.cfdi),
    tap(cfdi => this.service.mostrarXml(cfdi))
  );

  @Effect()
  getFail$ = this.actions$.pipe(
    ofType<fromActions.LoadCfdisFail>(CfdiActionTypes.LoadCfdisFail),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
