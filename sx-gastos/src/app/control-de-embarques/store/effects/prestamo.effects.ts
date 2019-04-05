import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromRoot from '../../../store';
import * as fromActions from '../actions/prestamo.actions';
import { FacturistaPrestamoService } from '../../services/facturista-prestamo.service';

@Injectable()
export class PrestamosEffects {
  @Effect()
  loadPrestamos$ = this.actions$.pipe(
    ofType<fromActions.LoadPrestamos>(
      fromActions.PrestamosActionTypes.LoadPrestamos
    ),
    map(action => action.payload.filter),
    switchMap(filter => {
      return this.service.list(filter.periodo).pipe(
        map(prestamos => new fromActions.LoadPrestamosSuccess({ prestamos })),
        catchError(response =>
          of(new fromActions.LoadPrestamosFail({ response: response }))
        )
      );
    })
  );

  @Effect()
  createPrestamo$ = this.actions$.pipe(
    ofType<fromActions.CreatePrestamo>(
      fromActions.PrestamosActionTypes.CreatePrestamo
    ),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.save(payload.prestamo).pipe(
        map(prestamo => new fromActions.CreatePrestamoSuccess({ prestamo })),
        catchError(response =>
          of(new fromActions.CreatePrestamoFail({ response }))
        )
      );
    })
  );

  @Effect()
  updatePrestamo$ = this.actions$.pipe(
    ofType<fromActions.UpdatePrestamo>(
      fromActions.PrestamosActionTypes.UpdatePrestamo
    ),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(prestamo => new fromActions.UpdatePrestamoSuccess({ prestamo })),
        catchError(response =>
          of(new fromActions.UpdatePrestamoFail({ response }))
        )
      );
    })
  );

  @Effect()
  deletePrestamo$ = this.actions$.pipe(
    ofType<fromActions.DeletePrestamo>(
      fromActions.PrestamosActionTypes.DeletePrestamo
    ),
    map(action => action.payload.prestamo),
    switchMap(prestamo => {
      return this.service.delete(prestamo.id).pipe(
        map(() => new fromActions.DeletePrestamoSuccess({ prestamo })),
        catchError(response =>
          of(new fromActions.DeletePrestamoFail({ response }))
        )
      );
    })
  );

  responses$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadPrestamosFail
      | fromActions.CreatePrestamoFail
      | fromActions.UpdatePrestamoFail
      | fromActions.DeletePrestamoFail
    >(
      fromActions.PrestamosActionTypes.LoadPrestamosFail,
      fromActions.PrestamosActionTypes.CreatePrestamoFail,
      fromActions.PrestamosActionTypes.UpdatePrestamoFail,
      fromActions.PrestamosActionTypes.DeletePrestamoFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );

  constructor(
    private actions$: Actions,
    private service: FacturistaPrestamoService
  ) {}
}
