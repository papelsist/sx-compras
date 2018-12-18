import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Cfdi } from '../../models';

import {
  PorCancelarActions,
  PorCancelarActionTypes
} from '../actions/por-cancelar.actions';

export interface State extends EntityState<Cfdi> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<Cfdi> = createEntityAdapter<Cfdi>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: PorCancelarActions
): State {
  switch (action.type) {
    case PorCancelarActionTypes.LoadCfdisPorCancelar: {
      return {
        ...state,
        loading: true
      };
    }

    case PorCancelarActionTypes.LoadCfdisPorCancelarFail: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case PorCancelarActionTypes.LoadCfdisPorCancelarSuccess: {
      return adapter.addAll(action.payload.pendientes, {
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

export const getCfdisPorCancelarLoading = (state: State) => state.loading;
export const getCfdisPorCancelarLoaded = (state: State) => state.loaded;
