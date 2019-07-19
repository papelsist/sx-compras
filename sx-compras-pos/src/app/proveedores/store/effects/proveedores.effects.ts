import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as proveedorActions from '../actions/proveedores.actions';
import * as fromServices from '../../services';

@Injectable()
export class ProveedoresEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ProveedoresService
  ) {}

  @Effect()
  loadEntites$ = this.actions$.pipe(
    ofType(proveedorActions.LOAD_PROVEEDORES),
    switchMap(() => {
      return this.service.list().pipe(
        map(
          proveedores =>
            new proveedorActions.LoadProveedoresSuccess(proveedores)
        ),
        catchError(error => of(new proveedorActions.LoadProveedoresFail(error)))
      );
    })
  );
}
