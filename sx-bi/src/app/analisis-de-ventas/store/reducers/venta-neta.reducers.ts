import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  VentaNetaActions,
  VentaNetaActionTypes
} from '../actions/venta-neta.actions';
import { VentaAcumulada } from '../../models/ventaAcumulada';

export interface State extends EntityState<any> {
  loading: boolean;
  loaded: boolean;
  filter: VentaAcumulada;
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: item => item.origenId
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: undefined
});

export function reducer(state = initialState, action: VentaNetaActions): State {
  switch (action.type) {
    case VentaNetaActionTypes.SetVentaNetaFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case VentaNetaActionTypes.LoadVentasNetas: {
      return {
        ...state,
        loading: true
      };
    }
    case VentaNetaActionTypes.LoadVentasNetasFail: {
      return {
        ...state,
        loading: false
      };
    }
    case VentaNetaActionTypes.LoadVentasNetasSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
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
export const getVentasNetasLoaded = (state: State) => state.loaded;
export const getVentaNetaFilter = (state: State) => state.filter;
