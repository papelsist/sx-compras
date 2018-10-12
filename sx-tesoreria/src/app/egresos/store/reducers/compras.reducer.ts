import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ComprasActionTypes, ComprasActions } from '../actions/compras.actions';

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

export function reducer(state = initialState, action: ComprasActions): State {
  switch (action.type) {
    case ComprasActionTypes.SetComprasFilter: {
      return {
        ...state,
        filter: action.payload.filter
      };
    }
    case ComprasActionTypes.LoadCompras: {
      return {
        ...state,
        loading: true
      };
    }

    case ComprasActionTypes.LoadComprasSuccess: {
      return adapter.addAll(action.payload.requisiciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }
    case ComprasActionTypes.UpsertCompra: {
      const requisicion = action.payload.requisicion;
      return adapter.upsertOne(requisicion, {
        ...state,
        loading: false
      });
    }

    case ComprasActionTypes.LoadComprasFail: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case ComprasActionTypes.PagarCompra: {
      return {
        ...state,
        loading: true
      };
    }

    case ComprasActionTypes.PagarCompraFail: {
      return {
        ...state,
        loading: false
      };
    }

    case ComprasActionTypes.PagarCompraSuccess: {
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

export const getComprasLoaded = (state: State) => state.loaded;
export const getComprasLoading = (state: State) => state.loading;
export const getComprasFilter = (state: State) => state.filter;
