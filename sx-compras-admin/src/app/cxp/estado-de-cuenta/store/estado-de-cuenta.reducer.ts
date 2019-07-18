import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Proveedor } from 'app/proveedores/models/proveedor';

import * as fromActions from './ecuenta.actions';
import { EstadoDeCuentaActionTypes } from './ecuenta.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State {
  proveedor: Proveedor;
  periodo: Periodo;
}

export const initialState: State = {
  proveedor: undefined,
  periodo: Periodo.monthToDay()
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

export const getEstadoState = createFeatureSelector<State>('estado-de-cuenta');

export const selectPeriodo = createSelector(
  getEstadoState,
  getPeriodo
);

export const selectProveedor = createSelector(
  getEstadoState,
  getProveedor
);
