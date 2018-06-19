import * as _ from 'lodash';

import * as fromAnalisis from '../actions/analisis.actions';

import { Analisis } from '../../model/analisis';

import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';

export interface AnalisisDeFacturaState {
  entities: { [id: string]: Analisis };
  loaded: boolean;
  loading: boolean;
  // Analisis CRUD
  curentProveedor: Proveedor;
  facturasPendientes: { [id: string]: CuentaPorPagar };
  comsPendientes: { [id: string]: RecepcionDeCompra };
}

export const initialState: AnalisisDeFacturaState = {
  entities: {},
  loaded: false,
  loading: false,
  curentProveedor: undefined,
  facturasPendientes: {},
  comsPendientes: {}
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

    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS:
    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS_FAIL:
    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS_SUCCESS:
    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS_SUCCESS: {
      const analisis = action.payload;
      const entities = {
        ...state.entities,
        [analisis.id]: analisis
      };
      return {
        ...state,
        loading: false,
        entities
      };
    }

    //
    case fromAnalisis.AnalisisActionTypes.LOAD_COMS_PENDIENTES: {
      return {
        ...state,
        loading: true
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_COMS_PENDIENTES_FAIL: {
      return {
        ...state,
        loaded: false
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_COMS_PENDIENTES_SUCCESS: {
      const comsPendientes = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loading: false,
        comsPendientes
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

export const getComsPendientes = (state: AnalisisDeFacturaState) =>
  state.comsPendientes;
