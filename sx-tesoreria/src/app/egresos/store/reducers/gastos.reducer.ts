import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { GastosActionTypes, GastosActions } from '../actions/gastos.actions';

import {
  Requisicion,
  RequisicionesFilter,
  createRequisicionesFilter
} from '../../models';

export interface State extends EntityState<Requisicion> {
  loading: boolean;
  loaded: boolean;
  filter: RequisicionesFilter;
}

export const adapter: EntityAdapter<Requisicion> = createEntityAdapter<
  Requisicion
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createRequisicionesFilter()
});

export function reducer(state = initialState, action: GastosActions): State {
  switch (action.type) {
    case GastosActionTypes.SetGastosFilter: {
      return {
        ...state,
        filter: action.payload.filter
      };
    }
    case GastosActionTypes.LoadGastos: {
      return {
        ...state,
        loading: true
      };
    }

    case GastosActionTypes.LoadGastosSuccess: {
      return adapter.addAll(action.payload.requisiciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }
    case GastosActionTypes.UpsertGasto: {
      const requisicion = action.payload.requisicion;
      return adapter.upsertOne(requisicion, {
        ...state,
        loading: false
      });
    }

    case GastosActionTypes.LoadGastosFail: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case GastosActionTypes.PagarGasto: {
      return {
        ...state,
        loading: true
      };
    }

    case GastosActionTypes.PagarGastoFail: {
      return {
        ...state,
        loading: false
      };
    }

    case GastosActionTypes.PagarGastoSuccess: {
      const requisicion = action.payload.requisicion;
      return adapter.upsertOne(requisicion, {
        ...state,
        loading: false
      });
    }
  }
  return state;
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getGastosLoaded = (state: State) => state.loaded;
export const getGastosLoading = (state: State) => state.loading;
export const getGastosFilter = (state: State) => state.filter;
