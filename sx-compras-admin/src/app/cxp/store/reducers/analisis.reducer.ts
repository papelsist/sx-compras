import * as _ from 'lodash';

import * as fromAnalisis from '../actions/analisis.actions';

import { Analisis } from '../../model/analisis';
import { ComprobanteFiscal } from '../../model/comprobanteFiscal';
import { Proveedor } from 'app/proveedores/models/proveedor';

export interface AnalisisDeFacturaState {
  entities: { [id: string]: Analisis };
  loaded: boolean;
  loading: boolean;
  // Analisis CRUD
  curentProveedor: Proveedor;
  facturasPendientes: { [id: string]: ComprobanteFiscal };
}

export const initialState: AnalisisDeFacturaState = {
  entities: {},
  loaded: false,
  loading: false,
  curentProveedor: undefined,
  facturasPendientes: {}
};

export function reducer(
  state = initialState,
  action: fromAnalisis.AnalisisActions
): AnalisisDeFacturaState {
  switch (action.type) {
    case fromAnalisis.AnalisisActionTypes.LOAD: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }
    case fromAnalisis.AnalisisActionTypes.SET_CURRENT_PROVEEDOR: {
      const proveedor = action.payload;
      return {
        ...state,
        curentProveedor: proveedor
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES: {
      return {
        ...state,
        loading: true
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_FAIL: {
      return {
        ...state,
        loaded: false
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_SUCCESS: {
      const facturasPendientes = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loading: false,
        facturasPendientes
      };
    }
  }
  return state;
}

export const getAnalisisLoaded = (state: AnalisisDeFacturaState) =>
  state.loaded;
export const getAnalisisLoading = (state: AnalisisDeFacturaState) =>
  state.loading;
export const getAnalisisEntities = (state: AnalisisDeFacturaState) =>
  state.entities;

export const getFacturasPendientes = (state: AnalisisDeFacturaState) =>
  state.facturasPendientes;
