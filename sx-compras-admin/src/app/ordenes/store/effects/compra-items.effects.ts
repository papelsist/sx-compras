import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { CompraDetActionTypes } from '../actions/compra-items.actions';
import * as fromActions from '../actions/compra-items.actions';

import { CompraItemsService } from '../../services';

@Injectable()
export class CompraItemsEffects {
  constructor(private actions$: Actions, private service: CompraItemsService) {}

  @Effect()
  loadItems$ = this.actions$.pipe(
    ofType<fromActions.LoadPartidas>(CompraDetActionTypes.LoadPartidas),
    map(action => action.payload.compraId),
    switchMap(compraId =>
      this.service.list(compraId).pipe(
        map(partidas => new fromActions.LoadPartidasSuccess({ partidas })),
        catchError(response =>
          of(new fromActions.LoadPartidasFail({ response }))
        )
      )
    )
  );
}
