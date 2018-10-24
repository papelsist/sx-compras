import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  VentaNetaActions,
  VentaNetaActionTypes
} from '../actions/venta-neta.actions';
import { VentaFilter } from '../../models/venta-filter';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';

export interface State extends EntityState<VentaNeta> {
  loading: boolean;
  loaded: boolean;
  filter: VentaFilter;
  selected: VentaNeta;
}
export function sortByVentaNeta(o1: VentaNeta, o2: VentaNeta) {
  return o2.ventaNeta - o1.ventaNeta;
}

export const adapter: EntityAdapter<VentaNeta> = createEntityAdapter<VentaNeta>(
  {
    selectId: item => item.origenId,
    sortComparer: sortByVentaNeta
  }
);

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: undefined,
  selected: undefined
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

    case VentaNetaActionTypes.SetSelectedVenta: {
      return {
        ...state,
        selected: action.payload.selected
      };
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
export const getVentaFilter = (state: State) => state.filter;
export const getSelected = (state: State) => state.selected;
