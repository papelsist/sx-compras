import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions/facturista.actions';
import { FacturistaService } from '../../services/facturistas.service';

@Injectable()
export class FacturistaEffects {
  @Effect()
  loadFacturistas$ = this.actions$.pipe(
    ofType<fromActions.LoadFacturistas>(
      fromActions.FacturistaActionTypes.LoadFacturistas
    ),
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

  constructor(private actions$: Actions, private service: FacturistaService) {}
}
