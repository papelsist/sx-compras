import * as fromProveedor from '../actions/proveedores.actions';

import { Proveedor } from '../../models/proveedor';

import * as _ from 'lodash';
import { ProveedoresSearch } from '../../models/proveedorSearch';

export interface ProveedorState {
  entities: { [id: string]: Proveedor };
  loaded: boolean;
  loading: boolean;
  searchFilter: ProveedoresSearch;
  current: string;
}

export const initialState: ProveedorState = {
  entities: {},
  loaded: false,
  loading: false,
  searchFilter: {},
  current: undefined
};

export function reducer(
  state = initialState,
  action: fromProveedor.ProveedoresActions
): ProveedorState {
  switch (action.type) {
    case fromProveedor.LOAD_PROVEEDORES: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromProveedor.LOAD_PROVEEDORES_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromProveedor.LOAD_PROVEEDORES_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromProveedor.SET_PROVEEDORES_FILTER: {
      const searchFilter = action.payload;
      return {
        ...state,
        searchFilter
      };
    }

    case fromProveedor.SET_CURRENT_PORVEEDOR: {
      const current = action.payload;
      return {
        ...state,
        current
      };
    }

    case fromProveedor.CREATE_PROVEEDOR_ACTION:
    case fromProveedor.UPDATE_PROVEEDOR_ACTION: {
      return {
        ...state,
        loading: true
      };
    }
    case fromProveedor.CREATE_PROVEEDOR_ACTION_FAIL:
    case fromProveedor.UPDATE_PROVEEDOR_ACTION_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromProveedor.CREATE_PROVEEDOR_ACTION_SUCCESS:
    case fromProveedor.UPDATE_PROVEEDOR_ACTION_SUCCESS: {
      const proveedor = action.payload;
      const entities = {
        ...state.entities,
        [proveedor.id]: proveedor
      };
      return {
        ...state,
        entities,
        loading: false
      };
    }
  }
  return state;
}

export const getProveedorEntites = (state: ProveedorState) => state.entities;
export const getProveedoresLoaded = (state: ProveedorState) => state.loaded;
export const getProveedoresLoading = (state: ProveedorState) => state.loading;
export const getProveedoresSearchFilter = (state: ProveedorState) =>
  state.searchFilter;
export const getCurrentProveedor = (state: ProveedorState) => state.current;
