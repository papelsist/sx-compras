import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  RequisicionActionTypes,
  RequisicionActions
} from '../actions/requisicion.actions';

import {
  Requisicion,
  RequisicionesFilter,
  createRequisicionesFilter
} from '../../model';

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

export function reducer(
  state = initialState,
  action: RequisicionActions
): State {
  switch (action.type) {
    case RequisicionActionTypes.LoadRequisciones: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }

    case RequisicionActionTypes.LoadRequiscionesSuccess: {
      return adapter.addAll(action.payload.requisiciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case RequisicionActionTypes.LOAD: {
      const requisicion = action.payload;
      return adapter.upsertOne(requisicion, {
        ...state,
        loading: false
      });
    }

    case RequisicionActionTypes.LoadRequiscionesFail:
    case RequisicionActionTypes.LOAD_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION:
    case RequisicionActionTypes.UPDATE_REQUISICION:
    case RequisicionActionTypes.CERRAR_REQUISICION: {
      return {
        ...state,
        loading: true
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION_FAIL:
    case RequisicionActionTypes.UPDATE_REQUISICION_FAIL:
    case RequisicionActionTypes.DELETE_REQUISICION_FAIL:
    case RequisicionActionTypes.CERRAR_REQUISICION_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION_SUCCESS:
    case RequisicionActionTypes.UPDATE_REQUISICION_SUCCESS:
    case RequisicionActionTypes.CERRAR_REQUISICION_SUCCESS: {
      const requisicion = action.payload;
      return adapter.upsertOne(requisicion, {
        ...state,
        loading: false
      });
    }

    // Delete
    case RequisicionActionTypes.DELETE_REQUISICION_SUCCESS: {
      const requisicion = action.payload;
      return adapter.removeOne(requisicion.id, {
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

export const getRequisicionLoaded = (state: State) => state.loaded;
export const getRequisicionLoading = (state: State) => state.loading;
export const getRequisicionEntities = (state: State) => state.entities;
export const getRequisicionesFilter = (state: State) => state.filter;
