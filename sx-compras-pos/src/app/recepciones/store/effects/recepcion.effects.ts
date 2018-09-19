import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromRecepcion from '../../store/selectors/recepcion.selectors';

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
      return this.store.pipe(select(fromRecepcion.getComsFilter), take(1));
    }),
    switchMap(filter => {
      return this.service
        .list(filter)
        .pipe(
          map(res => new fromActions.LoadComsSuccess(res)),
          catchError(error => of(new fromActions.LoadComsFail(error)))
        );
    })
  );

  @Effect()
  addCom$ = this.actions$.pipe(
    ofType<fromActions.AddRecepcionDeCompra>(
      RecepcionDeCompraActionTypes.AddRecepcionDeCompra
    ),
    map(action => action.payload),
    switchMap(com => {
      return this.service
        .save(com)
        .pipe(
          map(res => new fromActions.AddRecepcionDeCompraSuccess(res)),
          catchError(error =>
            of(new fromActions.AddRecepcionDeCompraFail(error))
          )
        );
    })
  );

  @Effect()
  addComSuccess$ = this.actions$.pipe(
    ofType<fromActions.AddRecepcionDeCompraSuccess>(
      RecepcionDeCompraActionTypes.AddRecepcionDeCompraSuccess
    ),
    map(action => action.payload),
    map(com => new fromRoot.Go({ path: ['recepciones', com.id] }))
  );

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetComsFilter>(
      RecepcionDeCompraActionTypes.SetComsFilter
    ),
    map(() => new fromActions.LoadComs())
  );

  @Effect({ dispatch: false })
  httpFail$ = this.actions$.pipe(
    ofType<fromActions.LoadComsFail | fromActions.AddRecepcionDeCompraFail>(
      RecepcionDeCompraActionTypes.LoadComsFail,
      RecepcionDeCompraActionTypes.AddRecepcionDeCompraFail
    ),
    map(action => action.payload),
    tap(response => {
      let message = response.error ? response.error.message : 'Error';
      console.error('Error: ', response);
      if (response.error) {
        const error = response.error;
        if (error.total) {
          message = `${error.total} Errores `;
        }
      }
      this.dialogService.openAlert({
        message: `${response.status} ${message}`,
        title: `Error ${response.status}`,
        closeButton: 'Cerrar'
      });
    })
  );
}
