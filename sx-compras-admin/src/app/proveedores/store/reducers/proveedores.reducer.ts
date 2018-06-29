import * as fromProveedor from '../actions/proveedores.actions';

import { Proveedor } from '../../models/proveedor';

import * as _ from 'lodash';
import { ProveedoresSearch } from '../../models/proveedorSearch';

export interface ProveedorState {
  entities: { [id: string]: Proveedor };
  loaded: boolean;
  loading: boolean;
  searchFilter: ProveedoresSearch;
}

export const initialState: ProveedorState = {
  entities: {},
  loaded: false,
  loading: false,
  searchFilter: {}
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
  }
  return state;
}

export const getProveedorEntites = (state: ProveedorState) => state.entities;
export const getProveedoresLoaded = (state: ProveedorState) => state.loaded;
export const getProveedoresLoading = (state: ProveedorState) => state.loading;
export const getProveedoresSearchFilter = (state: ProveedorState) =>
  state.searchFilter;
