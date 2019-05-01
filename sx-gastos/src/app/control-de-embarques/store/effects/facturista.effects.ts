import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions/facturista.actions';
import { FacturistaActionTypes } from '../actions/facturista.actions';
import { FacturistaService } from '../../services/facturistas.service';

@Injectable()
export class FacturistaEffects {
  @Effect()
  loadFacturistas$ = this.actions$.pipe(
    ofType<fromActions.LoadFacturistas>(FacturistaActionTypes.LoadFacturistas),
    switchMap(action => {
      return this.service.list().pipe(
        map(
          facturistas => new fromActions.LoadFacturistasSuccess({ facturistas })
        ),
        catchError(error =>
          of(new fromActions.LoadFacturistasFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateFacturista>(
      FacturistaActionTypes.CreateFacturista
    ),
    map(action => action.payload.facturista),
    switchMap(facturista => {
      return this.service.save(facturista).pipe(
        map(
          res => new fromActions.CreateFacturistaSuccess({ facturista: res })
        ),
        catchError(error =>
          of(new fromActions.CreateFacturistaFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateFacturista>(
      FacturistaActionTypes.UpdateFacturista
    ),
    map(action => action.payload.facturista),
    switchMap(facturista => {
      return this.service.update(facturista).pipe(
        map(
          res => new fromActions.UpdateFacturistaSuccess({ facturista: res })
        ),
        catchError(error =>
          of(new fromActions.UpdateFacturistaFail({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteFacturista>(
      FacturistaActionTypes.DeleteFacturista
    ),
    map(action => action.payload.facturistaId),
    switchMap(facturistaId => {
      return this.service.delete(facturistaId).pipe(
        map(res => new fromActions.DeleteFacturistaSuccess({ facturistaId })),
        catchError(error =>
          of(new fromActions.DeleteFacturistaFail({ response: error }))
        )
      );
    })
  );

  constructor(private actions$: Actions, private service: FacturistaService) {}
}
