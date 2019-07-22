import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Proveedor } from 'app/proveedores/models/proveedor';

import * as fromActions from './ecuenta.actions';
import { EstadoDeCuentaActionTypes } from './ecuenta.actions';
import { Periodo } from 'app/_core/models/periodo';
import { EstadoDecuentaRow } from './estadoDeCuentaRow';
import { CuentaPorPagar } from 'app/cxp/model';

export const EstadoDeCuentaPeriodoKey = 'sx.cxp.etado-de-cuenta.periodo';

export interface State {
  periodo: Periodo;
  proveedor: Proveedor;
  estadoDeCuenta: any;
  facturas: CuentaPorPagar[];
  loading: boolean;
  loaded: boolean;
}

export const initialState: State = {
  periodo: Periodo.fromStorage(EstadoDeCuentaPeriodoKey),
  proveedor: undefined,
  estadoDeCuenta: undefined,
  facturas: [],
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: fromActions.EstadoDeCuentaActions
): State {
  switch (action.type) {
    case EstadoDeCuentaActionTypes.SetProveedor: {
      return {
        ...state,
        proveedor: action.payload.proveedor
      };
    }
    case EstadoDeCuentaActionTypes.SetPeriodo: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }
    case EstadoDeCuentaActionTypes.LoadFacturas:
    case EstadoDeCuentaActionTypes.LoadEstadoDeCuenta: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }

    case EstadoDeCuentaActionTypes.LoadFacturasFail:
    case EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case EstadoDeCuentaActionTypes.LoadEstadoDeCuentaSuccess: {
      return {
        ...state,
        loaded: true,
        loading: false,
        estadoDeCuenta: action.payload.data
      };
    }

    case EstadoDeCuentaActionTypes.LoadFacturasSuccess: {
      return {
        ...state,
        loading: false,
        facturas: action.payload.facturas
      };
    }

    default:
      return {
        ...state
      };
  }
}

const getProveedor = (state: State) => state.proveedor;
const getPeriodo = (state: State) => state.periodo;
const getEstado = (state: State) => state.estadoDeCuenta;
const getLoading = (state: State) => state.loading;
const getLoaded = (state: State) => state.loaded;
const getFacturas = (state: State) => state.facturas;

export const getEstadoState = createFeatureSelector<State>('estado-de-cuenta');

export const selectPeriodo = createSelector(
  getEstadoState,
  getPeriodo
);

export const selectProveedor = createSelector(
  getEstadoState,
  getProveedor
);

export const selectEstado = createSelector(
  getEstadoState,
  getEstado
);
export const selectLoading = createSelector(
  getEstadoState,
  getLoading
);
export const selectLoaded = createSelector(
  getEstadoState,
  getLoaded
);

export const selectMovimientos = createSelector(
  selectEstado,
  edo => {
    if (!!edo) {
      return edo.movimientos;
    }
    return [];
  }
);

export const selectFacturas = createSelector(
  getEstadoState,
  getFacturas
);
