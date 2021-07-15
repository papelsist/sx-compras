import * as fromProductos from '../actions/productos.actions';

import { Producto } from '../../models/producto';

import * as _ from 'lodash';

export interface ProductoState {
  entities: { [id: string]: Producto };
  loaded: boolean;
  loading: boolean;
}


export const initialState: ProductoState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromProductos.ProductosAction
): ProductoState {
  switch (action.type) {
    case fromProductos.LOAD_PRODUCTOS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromProductos.LOAD_PRODUCTOS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromProductos.LOAD_PRODUCTOS_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromProductos.REMOVE_PRODUCTO:
    case fromProductos.CREATE_PRODUCTO:
    case fromProductos.UPDATE_PRODUCTO:
    case fromProductos.UPDATE_PRODUCTO_ECOMMERCE:
    {
      console.log('Ejecutando el reducer');
      return {
        ...state,
        loading: true
      };
    }

    case fromProductos.REMOVE_PRODUCTO_FAIL:
    case fromProductos.CREATE_PRODUCTO_FAIL:
    case fromProductos.UPDATE_PRODUCTO_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromProductos.UPSERT_PRODUCTO:
    case fromProductos.UPDATE_PRODUCTO_SUCCESS:
    case fromProductos.CREATE_PRODUCTO_SUCCESS: {
      const producto = action.payload;
      const entities = {
        ...state.entities,
        [producto.id]: producto
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromProductos.REMOVE_PRODUCTO_SUCCESS: {
      const producto = action.payload;
      const { [producto.id]: result, ...entities } = state.entities;
      return {
        ...state,
        loading: false,
        entities
      };
    }

    case fromProductos.SEARCH_PRODUCTOS_SUCCESS: {
      const newEntities = _.keyBy(action.payload, 'id');
      const entities = { ...state.entities, ...newEntities };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }
  }

  return state;
}

export const getProductosLoading = (state: ProductoState) => state.loading;
export const getProductosLoaded = (state: ProductoState) => state.loaded;
export const getProductosEntities = (state: ProductoState) => state.entities;
