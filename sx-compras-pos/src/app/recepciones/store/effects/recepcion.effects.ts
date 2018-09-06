import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  catchError,
  take,
  delay,
  mergeMap
} from 'rxjs/operators';

import { RecepcionDeCompraActionTypes } from '../actions/recepcion.actions';
import * as fromActions from '../actions/recepcion.actions';
import { RecepcionDeCompraService } from '../../services';
import { Periodo } from 'app/_core/models/periodo';

import { TdDialogService } from '@covalent/core';

@Injectable()
export class RecepcionDeCompraEffects {
  constructor(
    private actions$: Actions,
    private service: RecepcionDeCompraService,
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  @Effect()
  loadComs$ = this.actions$.pipe(
    ofType(RecepcionDeCompraActionTypes.LoadComs),
    switchMap(() => {
      return this.service
        .list()
        .pipe(
          map(res => new fromActions.LoadComsSuccess(res)),
          catchError(error => of(new fromActions.LoadComsFail(error)))
        );
    })
  );

  @Effect({ dispatch: false })
  httpFail$ = this.actions$.pipe(
    ofType<fromActions.LoadComsFail | fromActions.AddRecepcionDeCompraFail>(
      RecepcionDeCompraActionTypes.LoadComsFail,
      RecepcionDeCompraActionTypes.AddRecepcionDeCompraFail
    ),
    map(action => action.payload),
    tap(response => {
      const message = response.error ? response.error.message : 'Error';
      console.error('Error: ', response.message);
      this.dialogService.openAlert({
        message: `${response.status} ${message}`,
        title: `Error ${response.status}`,
        closeButton: 'Cerrar'
      });
    })
  );
}
