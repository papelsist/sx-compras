import {
  ApplicationActions,
  ApplicationActionTypes
} from '../actions/application.actions';
import { Sucursal } from '../../models';

export interface State {
  sucursal: Sucursal;
  globalLoading: boolean;
}

export const initialState: State = {
  sucursal: undefined,
  globalLoading: false
};

export function reducer(
  state = initialState,
  action: ApplicationActions
): State {
  switch (action.type) {
    case ApplicationActionTypes.LoadSucursalSuccess: {
      const sucursal = action.payload.sucursal;
      return {
        ...state,
        sucursal
      };
    }

    case ApplicationActionTypes.SetGlobalLoading: {
      const globalLoading = action.payload.loading;
      return {
        ...state,
        globalLoading
      };
    }

    default: {
      return state;
    }
  }
}

export const getSucursal = (state: State) => state.sucursal;
export const getGlobalLoading = (state: State) => state.globalLoading;
