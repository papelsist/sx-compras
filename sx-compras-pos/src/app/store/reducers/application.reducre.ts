import {
  ApplicationActions,
  ApplicationActionTypes
} from '../actions/application.actions';
import { Sucursal } from '../../models';

export interface State {
  sucursal: Sucursal;
}

export const initialState: State = {
  sucursal: undefined
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): State {
  switch (action.type) {
    case ApplicationActionTypes.LoadSucursal: {
      const sucursal = action.payload.sucursal;
      return {
        ...state,
        sucursal
      };
    }

    default: {
      return state;
    }
  }
}

export const getSucursal = (state: State) => state.sucursal;
