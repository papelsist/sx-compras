import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromForm from '../actions/requisicion-form.actions';

import * as fromServices from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class RequisicionFormEffects {
  constructor(
    private actions$: Actions,
    private service: fromServices.RequisicionesService,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  loadFacturasPorRequisitar$ = this.actions$.pipe(
    ofType<fromForm.LoadFacturasPorRequisitar>(
      fromForm.FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR
    ),
    map(action => action.payload),
    switchMap(proveedorId => {
      return this.service.pendientes(proveedorId).pipe(
        map(res => new fromForm.LoadFacturasPorRequisitarSuccess(res)),
        catchError(error =>
          of(new fromForm.LoadFacturasPorRequisitarFail(error))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  requisicionFormErrorHandler$ = this.actions$.pipe(
    ofType<fromForm.LoadFacturasPorRequisitarFail>(
      fromForm.FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR_FAIL
    ),
    map((action: any) => {
      const error = action.payload;
      this.snackBar.open(
        `Error cargando facturas pendientes: ${error.status}: ${
          error.statusText
        }`,
        'Cerrar',
        {
          duration: 8000
        }
      );
    })
  );
}
