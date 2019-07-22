import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lineasActions from '../actions/lineas.actions';
import * as fromService from '../../services';
import { LineasService } from '../../services';

@Injectable()
export class LineasEffects {
  constructor(
    private actions$: Actions,
    private lineasService: LineasService
  ) {}

  @Effect()
  loadLineas$ = this.actions$.pipe(
    ofType(lineasActions.LOAD_LINEAS),
    switchMap(() => {
      return this.lineasService.list().pipe(
        map(lineas => new lineasActions.LoadLineasSuccess(lineas)),
        catchError((error: any) => of(new lineasActions.LoadLineasFail(error)))
      );
    })
  );

  @Effect()
  createLinea$ = this.actions$.pipe(
    ofType(lineasActions.CREATE_LINEA),
    map((action: lineasActions.CreateLinea) => action.payload),
    switchMap(linea => {
      return this.lineasService.save(linea).pipe(
        map(newLine => new lineasActions.CreateLineaSuccess(newLine)),
        catchError(error => of(new lineasActions.CreateLineaFail(error)))
      );
    })
  );

  @Effect()
  updateLinea$ = this.actions$.pipe(
    ofType(lineasActions.UPDATE_LINEA),
    map((action: lineasActions.UpdateLinea) => action.payload),
    switchMap(linea => {
      return this.lineasService.update(linea).pipe(
        map(updatedLinea => new lineasActions.UpdateLineaSuccess(updatedLinea)),
        catchError(error => of(new lineasActions.UpdateLineaFail(error)))
      );
    })
  );

  @Effect()
  removeLinea$ = this.actions$.pipe(
    ofType(lineasActions.REMOVE_LINEA),
    map((action: lineasActions.RemoveLinea) => action.payload),
    switchMap(linea => {
      return this.lineasService.delete(linea.id).pipe(
        map(() => new lineasActions.RemoveLineaSuccess(linea)),
        catchError(error => of(new lineasActions.RemoveLinea(error)))
      );
    })
  );
}
