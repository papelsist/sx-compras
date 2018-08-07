import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  ProductosDisponiblesActions,
  ProductosDisponiblesActionTypes
} from '../actions/productos-disponibles.actions';

import { ProveedorProducto } from 'app/proveedores/models/proveedorProducto';

export interface State extends EntityState<ProveedorProducto> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<ProveedorProducto> = createEntityAdapter<
  ProveedorProducto
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: ProductosDisponiblesActions
): State {
  switch (action.type) {
    case ProductosDisponiblesActionTypes.LoadProductosDisponibles: {
      return {
        ...state,
        loading: true
      };
    }
    case ProductosDisponiblesActionTypes.LoadProductosDisponiblesFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ProductosDisponiblesActionTypes.LoadProductosDisponiblesSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ProductosDisponiblesActionTypes.ClearProductosDisponibles: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getProductosDisponiblesLoading = (state: State) => state.loading;
export const getProductosDisponiblesLoaded = (state: State) => state.loaded;
