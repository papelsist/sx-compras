import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Proveedor } from 'app/proveedores/models/proveedor';

import * as fromActions from './ecuenta.actions';
import { EstadoDeCuentaActionTypes } from './ecuenta.actions';
import { Periodo } from 'app/_core/models/periodo';
import { EstadoDecuentaRow } from './estadoDeCuentaRow';

export const EstadoDeCuentaPeriodoKey = 'sx.cxp.etado-de-cuenta.periodo';

export interface State {
  periodo: Periodo;
  proveedor: Proveedor;
  estadoDeCuenta: any;
  loading: boolean;
  loaded: boolean;
}

export const initialState: State = {
  periodo: Periodo.fromStorage(EstadoDeCuentaPeriodoKey),
  proveedor: undefined,
  estadoDeCuenta: undefined,
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
