import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as fromListas from '../actions/listasDePrecios.actions';

import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';

import * as _ from 'lodash';

export interface ListasDePrecioState
  extends EntityState<ListaDePreciosProveedor> {
  loaded: boolean;
  loading: boolean;
}
export const adapter: EntityAdapter<
  ListaDePreciosProveedor
> = createEntityAdapter<ListaDePreciosProveedor>({
  sortComparer: entity => entity.id
});

export const initialState: ListasDePrecioState = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: fromListas.ListasDePreciosActions
): ListasDePrecioState {
  switch (action.type) {
    case fromListas.LOAD_LISTAS_PROVEEDOR: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }
    case fromListas.LOAD_LISTAS_PROVEEDOR_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case fromListas.LOAD_LISTAS_PROVEEDOR_SUCCESS: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    // Add
    case fromListas.ADD_LISTA_PROVEEDOR: {
      return state;
    }
    case fromListas.ADD_LISTA_PROVEEDOR_FAIL: {
      return state;
    }
    case fromListas.ADD_LISTA_PROVEEDOR_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }

    // Delete
    case fromListas.DELETE_LISTA_PROVEEDOR_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }

    // Actualizar compras
    case fromListas.ACTUALIZAR_COMPRAS_CONLISTA: {
      return {
        ...state,
        loading: true
      };
    }
    case fromListas.ACTUALIZAR_COMPRAS_CONLISTA_SUCCESS:
    case fromListas.ACTUALIZAR_COMPRAS_CONLISTA_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

export const getListasProveedorLoading = (state: ListasDePrecioState) =>
  state.loading;
export const getListasProveedorLoaded = (state: ListasDePrecioState) =>
  state.loaded;
