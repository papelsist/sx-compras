import {
  EstadoDeCuentaActions,
  EstadoDeCuentaActionTypes
} from '../actions/estado-de-cuenta.actions';

import { EstadoDeCuenta } from 'app/cuentas/models/estado-de-cuenta';

export interface State {
  loading: boolean;
  estadoDeCuenta: EstadoDeCuenta;
}

export const initialState: State = {
  loading: false,
  estadoDeCuenta: undefined
};

export function reducer(
  state = initialState,
  action: EstadoDeCuentaActions
): State {
  switch (action.type) {
    case EstadoDeCuentaActionTypes.CerrarCuenta:
    case EstadoDeCuentaActionTypes.GetEstado: {
      return {
        ...state,
        loading: true
      };
    }
    case EstadoDeCuentaActionTypes.CerrarCuentaFail:
    case EstadoDeCuentaActionTypes.GetEstadoFail: {
      return {
        ...state,
        loading: false
      };
    }

    case EstadoDeCuentaActionTypes.GetEstadoSuccess: {
      return {
        ...state,
        loading: false,
        estadoDeCuenta: action.payload.estadoDeCuenta
      };
    }

    case EstadoDeCuentaActionTypes.CerrarCuentaSuccess: {
      return {
        ...state,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getEstadoLoading = (state: State) => state.loading;
export const getEstadoDeCuenta = (state: State) => state.estadoDeCuenta;
export const getMovimientos = (state: State) =>
  state.estadoDeCuenta.movimientos;
