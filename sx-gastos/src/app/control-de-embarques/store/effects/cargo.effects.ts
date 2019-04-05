import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromRoot from '../../../store';
import * as fromActions from '../actions/cargos.actions';
import { FacturistaCargoService } from '../../services/facturista-cargo.service';

@Injectable()
export class CargosEffects {
  @Effect()
  loadCargos$ = this.actions$.pipe(
    ofType<fromActions.LoadCargos>(fromActions.CargosActionTypes.LoadCargos),
    map(action => action.payload.filter),
    switchMap(filter => {
      return this.service.list(filter.periodo).pipe(
        map(cargos => new fromActions.LoadCargosSuccess({ cargos })),
        catchError(response =>
          of(new fromActions.LoadCargosFail({ response: response }))
        )
      );
    })
  );

  @Effect()
  createCargo$ = this.actions$.pipe(
    ofType<fromActions.CreateCargo>(fromActions.CargosActionTypes.CreateCargo),
    map(action => action.payload),
    switchMap(payload => {
      return this.service.save(payload.cargo).pipe(
        map(cargo => new fromActions.CreateCargoSuccess({ cargo })),
        catchError(response =>
          of(new fromActions.CreateCargoFail({ response }))
        )
      );
    })
  );

  @Effect()
  updateCargo$ = this.actions$.pipe(
    ofType<fromActions.UpdateCargo>(fromActions.CargosActionTypes.UpdateCargo),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(cargo => new fromActions.UpdateCargoSuccess({ cargo })),
        catchError(response =>
          of(new fromActions.UpdateCargoFail({ response }))
        )
      );
    })
  );

  @Effect()
  deleteCargo$ = this.actions$.pipe(
    ofType<fromActions.DeleteCargo>(fromActions.CargosActionTypes.DeleteCargo),
    map(action => action.payload.cargo),
    switchMap(cargo => {
      return this.service.delete(cargo.id).pipe(
        map(() => new fromActions.DeleteCargoSuccess({ cargo })),
        catchError(response =>
          of(new fromActions.DeleteCargoFail({ response }))
        )
      );
    })
  );

  responses$ = this.actions$.pipe(
    ofType<
      | fromActions.LoadCargosFail
      | fromActions.CreateCargoFail
      | fromActions.UpdateCargoFail
      | fromActions.DeleteCargoFail
    >(
      fromActions.CargosActionTypes.LoadCargosFail,
      fromActions.CargosActionTypes.CreateCargoFail,
      fromActions.CargosActionTypes.UpdateCargoFail,
      fromActions.CargosActionTypes.DeleteCargoFail
    ),
    map(action => action.payload.response),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );

  constructor(
    private actions$: Actions,
    private service: FacturistaCargoService
  ) {}
}
