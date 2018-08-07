import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AlcanceActions, AlcanceActionTypes } from '../actions/alcance.actions';

@Injectable()
export class AlcanceEffects {

  @Effect()
  effect$ = this.actions$.ofType(AlcanceActionTypes.LoadAlcances);

  constructor(private actions$: Actions) {}
}
