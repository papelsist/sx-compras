import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  ComprobanteFiscal,
  CfdisFilter,
  createDefaultFilter
} from '../../model';
import {
  ComprobanteActions,
  ComprobanteActionTypes
} from '../actions/cfdi.actions';

export interface State extends EntityState<ComprobanteFiscal> {
  loading: boolean;
  loaded: boolean;
  filter: CfdisFilter;
  searchTerm: string;
  selectedIds: string[];
}

export const adapter: EntityAdapter<ComprobanteFiscal> = createEntityAdapter<
  ComprobanteFiscal
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createDefaultFilter(),
  searchTerm: '',
  selectedIds: []
});

export function reducer(
  state = initialState,
  action: ComprobanteActions
): State {
  switch (action.type) {
    case ComprobanteActionTypes.LoadComprobantes: {
      return {
        ...state,
        loading: true
      };
    }

    case ComprobanteActionTypes.UpdateComprobanteFail:
    case ComprobanteActionTypes.LoadComprobantesFail: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case ComprobanteActionTypes.LoadComprobantesSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ComprobanteActionTypes.UpdateComprobanteSuccess: {
      const cfdi = action.payload;
      return adapter.upsertOne(cfdi, {
        ...state,
        loading: false
      });
    }

    case ComprobanteActionTypes.ClearComprobantes: {
      return adapter.removeAll(state);
    }

    case ComprobanteActionTypes.SetCfdisFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case ComprobanteActionTypes.SetCfdisSearchTerm: {
      const searchTerm = action.payload.term;
      return {
        ...state,
        searchTerm
      };
    }

    case ComprobanteActionTypes.SelectCfdis: {
      const selectedIds = action.payload.ids;
      return {
        ...state,
        selectedIds
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

export const getComprobantesLoading = (state: State) => state.loading;
export const getComprobantesLoaded = (state: State) => state.loaded;
export const getComprobantesFilter = (state: State) => state.filter;
export const getComprobantesSearchTerm = (state: State) => state.searchTerm;
export const getSelectedIds = (state: State) => state.selectedIds;
