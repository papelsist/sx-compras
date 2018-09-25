import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as proveedorActions from '../actions/proveedores.actions';
import * as fromServices from '../../services';
import * as fromRoot from 'app/store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ProveedoresEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.ProveedoresService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  loadEntites$ = this.actions$.ofType(proveedorActions.LOAD_PROVEEDORES).pipe(
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

  @Effect()
  updateProveedor$ = this.actions$
    .ofType(proveedorActions.UPDATE_PROVEEDOR_ACTION)
    .pipe(
      map((action: proveedorActions.UpdateProveedor) => action.payload),
      switchMap(proveedor => {
        return this.service.update(proveedor).pipe(
          map(res => new proveedorActions.UpdateProveedorSuccess(res)),
          catchError(error =>
            of(new proveedorActions.UpdateProveedorFail(error))
          )
        );
      })
    );

  @Effect({ dispatch: false })
  updateSuccess$ = this.actions$.pipe(
    ofType<proveedorActions.UpdateProveedorSuccess>(
      proveedorActions.UPDATE_PROVEEDOR_ACTION_SUCCESS
    ),
    map(action => action.payload),
    tap(proveedores =>
      this.snackBar.open(
        `Proveedor ${proveedores.nombre} actualizado `,
        'Cerrar',
        {
          duration: 2000
        }
      )
    )
  );

  @Effect()
  createProveedor$ = this.actions$
    .ofType(proveedorActions.CREATE_PROVEEDOR_ACTION)
    .pipe(
      map((action: proveedorActions.CreateProveedor) => action.payload),
      switchMap(proveedor => {
        return this.service.save(proveedor).pipe(
          map(res => new proveedorActions.CreateProveedorSuccess(res)),
          catchError(error =>
            of(new proveedorActions.CreateProveedorFail(error))
          )
        );
      })
    );

  @Effect()
  createSuccess$ = this.actions$.pipe(
    ofType<proveedorActions.CreateProveedorSuccess>(
      proveedorActions.CREATE_PROVEEDOR_ACTION_SUCCESS
    ),
    map(action => action.payload),
    map(
      proveedores => new fromRoot.Go({ path: ['proveedores', proveedores.id] })
    )
  );
}
