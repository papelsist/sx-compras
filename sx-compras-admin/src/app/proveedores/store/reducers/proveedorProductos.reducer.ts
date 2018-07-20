import * as fromProductos from '../actions/proveedorProducto.actions';

import { ProveedorProducto } from '../../models/proveedorProducto';

import * as _ from 'lodash';

export interface ProveedorProductosState {
  entities: { [id: string]: ProveedorProducto };
  loaded: boolean;
  loading: boolean;
  searchFilter: string;
}

export const initialState: ProveedorProductosState = {
  entities: {},
  loaded: false,
  loading: false,
  searchFilter: ''
};

export function reducer(
  state = initialState,
  action: fromProductos.ProveedorProductosActions
): ProveedorProductosState {
  switch (action.type) {
    case fromProductos.LOAD_PROVEEDOR_PRODUCTOS: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromProductos.LOAD_PROVEEDOR_PRODUCTOS_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }

    case fromProductos.LOAD_PROVEEDOR_PRODUCTOS_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromProductos.SET_PROVEEDOR_PRODUCTOS_FILTER: {
      const searchFilter = action.payload;
      return {
        ...state,
        searchFilter
      };
    }

    case fromProductos.UPDATE_PROVEEDOR_PRODUCTO_ACTION_SUCCESS: {
      const producto = action.payload;
      const entities = {
        ...state.entities,
        [producto.id]: producto
      };
      return {
        ...state,
        entities,
        loading: false
      };
    }

    case fromProductos.DELETE_PROVEEDOR_PRODUCTO:
    case fromProductos.ADD_PROVEEDOR_PRODUCTOS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromProductos.DELETE_PROVEEDOR_PRODUCTO_FAIL:
    case fromProductos.ADD_PROVEEDOR_PRODUCTOS_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromProductos.ADD_PROVEEDOR_PRODUCTOS_SUCCESS: {
      const productos = _.keyBy(action.payload, 'id');
      const entities = { ...state.entities, ...productos };
      return {
        ...state,
        loading: false,
        entities
      };
    }

    case fromProductos.DELETE_PROVEEDOR_PRODUCTO_SUCCESS: {
      const producto = action.payload;
      const { [producto.id]: result, ...entities } = state.entities;
      return {
        ...state,
        loading: false,
        entities
      };
    }
  }
  return state;
}

export const getProveedorProductosEntites = (state: ProveedorProductosState) =>
  state.entities;
export const getProveedorProductosLoaded = (state: ProveedorProductosState) =>
  state.loaded;
export const getProveedorProductosLoading = (state: ProveedorProductosState) =>
  state.loading;
export const getProveedorProductosSearchFilter = (
  state: ProveedorProductosState
) => state.searchFilter;
