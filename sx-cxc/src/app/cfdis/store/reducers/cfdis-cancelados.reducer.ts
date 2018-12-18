import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CfdiCancelado, CfdisFilter, createDefaultFilter } from '../../models';

import {
  CfdiCanceladoActions,
  CfdiCanceladoActionTypes
} from '../actions/cancelados.actions';

export interface State extends EntityState<CfdiCancelado> {
  loading: boolean;
  loaded: boolean;
  filter: CfdisFilter;
  searchTerm: string;
}

export const adapter: EntityAdapter<CfdiCancelado> = createEntityAdapter<
  CfdiCancelado
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createDefaultFilter(),
  searchTerm: ''
});

export function reducer(
  state = initialState,
  action: CfdiCanceladoActions
): State {
  switch (action.type) {
    case CfdiCanceladoActionTypes.LoadCfdisCancelados: {
      return {
        ...state,
        loading: true
      };
    }

    case CfdiCanceladoActionTypes.LoadCfdisCanceladosFail: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case CfdiCanceladoActionTypes.LoadCfdisCanceladosSuccess: {
      return adapter.addAll(action.payload.cancelados, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CfdiCanceladoActionTypes.SetCfdisCanceladosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case CfdiCanceladoActionTypes.SetCfdisCanceladosSearchTerm: {
      const searchTerm = action.payload.term;
      return {
        ...state,
        searchTerm
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

export const getCfdisCanceladosLoading = (state: State) => state.loading;
export const getCfdisCanceldadosLoaded = (state: State) => state.loaded;
export const getCfdisCanceladosFilter = (state: State) => state.filter;
export const getCfdisCanceladosSearchTerm = (state: State) => state.searchTerm;
