import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AlcanceActions, AlcanceActionTypes } from '../actions/alcance.actions';

@Injectable()
export class AlcanceEffects {
  @Effect()
  effect$ = this.actions$.pipe(ofType(AlcanceActionTypes.LoadAlcances));

  constructor(private actions$: Actions) {}
}
