import * as fromActions from '../actions/cartera.actions';
import { Cartera } from 'app/cobranza/models';

export interface State {
  cartera: Cartera;
}

export const initialState: State = {
  cartera: undefined
};

export function reducer(
  state = initialState,
  action: fromActions.CarteraActions
): State {
  switch (action.type) {
    case fromActions.CarteraActionTypes.SetCartera:
      const cartera = action.payload.cartera;
      return {
        ...state,
        cartera
      };
    default:
      return {
        ...state
      };
  }
}

export const getCartera = (state: State) => state.cartera;
