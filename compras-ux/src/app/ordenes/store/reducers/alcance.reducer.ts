import { Action } from '@ngrx/store';
import { AlcanceActions, AlcanceActionTypes } from '../actions/alcance.actions';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: AlcanceActions): State {
  switch (action.type) {

    case AlcanceActionTypes.LoadAlcances:
      return state;


    default:
      return state;
  }
}
