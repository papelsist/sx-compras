import * as _ from 'lodash';

import { AnalisisActionTypes } from '../actions/analisis.actions';
import * as fromAnalisis from '../actions/analisis.actions';

import { Analisis } from '../../model/analisis';

import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';
import { Periodo } from '../../../_core/models/periodo';

export interface AnalisisDeFacturaState {
  entities: { [id: string]: Analisis };
  periodo: Periodo;
  filter: Object;
  loaded: boolean;
  loading: boolean;
  // Analisis CRUD
  curentProveedor: Proveedor;
  facturasPendientes: { [id: string]: CuentaPorPagar };
  comsPendientes: { [id: string]: RecepcionDeCompra };
}

export const initialState: AnalisisDeFacturaState = {
  entities: {},
  periodo: Periodo.fromStorage(
    'sx-compras.analisis.periodo',
    Periodo.monthToDay()
  ),
  filter: { tipo: 'Pendientes' },
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

    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS:
    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS:
    case fromAnalisis.AnalisisActionTypes.CERRAR_ANALISIS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS_FAIL:
    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS_FAIL:
    case fromAnalisis.AnalisisActionTypes.DELETE_ANALISIS_FAIL:
    case fromAnalisis.AnalisisActionTypes.CERRAR_ANALISIS_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromAnalisis.AnalisisActionTypes.SAVE_ANALISIS_SUCCESS:
    case fromAnalisis.AnalisisActionTypes.UPDATE_ANALISIS_SUCCESS:
    case fromAnalisis.AnalisisActionTypes.CERRAR_ANALISIS_SUCCESS: {
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
    // Delete analisis
    case AnalisisActionTypes.DELETE_ANALISIS_SUCCESS: {
      const analisis = action.payload;
      const { [analisis.id]: result, ...entities } = state.entities;
      const comsPendientes = {};
      return {
        ...state,
        loading: false,
        entities,
        comsPendientes
      };
    }

    case AnalisisActionTypes.SET_SEARCH_FILTER: {
      const filter = action.payload;
      return {
        ...state,
        filter
      };
    }
    case AnalisisActionTypes.SET_ANALSIS_PERIODO: {
      const periodo = action.payload;
      return {
        ...state,
        periodo
      };
    }

    case AnalisisActionTypes.LOAD_ANALISIS: {
      const analisis = action.payload;
      const entities = {
        ...state.entities,
        [analisis.id]: analisis
      };
      return {
        ...state,
        entities
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

export const getAnalisisPeriodo = (state: AnalisisDeFacturaState) =>
  state.periodo;

export const getAnalisisFilter = (state: AnalisisDeFacturaState) =>
  state.filter;
