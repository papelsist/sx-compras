import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  VentaPorProductoActions,
  VentaPorProductoActionTypes
} from '../actions/venta-por-producto';

import { VentaAcumulada } from '../../models/ventaAcumulada';

export interface State extends EntityState<any> {
  loading: boolean;
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: item => item.origenId
});

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: VentaPorProductoActions
): State {
  switch (action.type) {
    case VentaPorProductoActionTypes.LoadVentaPorProducto: {
      return {
        ...state,
        loading: true
      };
    }
    case VentaPorProductoActionTypes.LoadVentaPorProductoFail: {
      return {
        ...state,
        loading: false
      };
    }
    case VentaPorProductoActionTypes.LoadVentaPorProductoSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false
      });
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

export const getVentasNetasLoading = (state: State) => state.loading;
