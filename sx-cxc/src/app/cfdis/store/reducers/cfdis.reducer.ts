import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Cfdi, CfdisFilter, createDefaultFilter } from '../../models';

import { CfdiActions, CfdiActionTypes } from '../actions/cfdis.actions';

export interface State extends EntityState<Cfdi> {
  loading: boolean;
  loaded: boolean;
  filter: CfdisFilter;
  searchTerm: string;
}

export const adapter: EntityAdapter<Cfdi> = createEntityAdapter<Cfdi>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createDefaultFilter(),
  searchTerm: ''
});

export function reducer(state = initialState, action: CfdiActions): State {
  switch (action.type) {
    case CfdiActionTypes.LoadCfdis: {
      return {
        ...state,
        loading: true
      };
    }

    case CfdiActionTypes.LoadCfdisFail: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case CfdiActionTypes.LoadCfdisSuccess: {
      return adapter.addAll(action.payload.cfdis, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CfdiActionTypes.ClearCfdis: {
      return adapter.removeAll(state);
    }

    case CfdiActionTypes.SetCfdisFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case CfdiActionTypes.SetCfdisSearchTerm: {
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

export const getCfdisLoading = (state: State) => state.loading;
export const getCfdisLoaded = (state: State) => state.loaded;
export const getCfdisFilter = (state: State) => state.filter;
export const getCfdisSearchTerm = (state: State) => state.searchTerm;
