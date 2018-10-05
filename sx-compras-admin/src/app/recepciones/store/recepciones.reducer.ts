import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  RecepcionesActions,
  RecepcionActionTypes
} from './recepciones.actions';
import { RecepcionDeCompra, ComsFilter, buildComsFilter } from '../models';

export interface State extends EntityState<RecepcionDeCompra> {
  loading: boolean;
  loaded: boolean;
  searchTerm: string;
  filter: ComsFilter;
  selected: string[];
}

export const adapter: EntityAdapter<RecepcionDeCompra> = createEntityAdapter<
  RecepcionDeCompra
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  searchTerm: '',
  filter: buildComsFilter(),
  selected: []
});

export function reducer(
  state = initialState,
  action: RecepcionesActions
): State {
  switch (action.type) {
    case RecepcionActionTypes.SetRecepcionesFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case RecepcionActionTypes.SetRecepcionesSearchTerm: {
      const searchTerm = action.payload.term;
      return {
        ...state,
        searchTerm
      };
    }
    case RecepcionActionTypes.LoadRecepciones: {
      return {
        ...state,
        loading: true
      };
    }
    case RecepcionActionTypes.LoadRecepcionesFail: {
      return {
        ...state,
        loading: false
      };
    }
    case RecepcionActionTypes.LoadRecepcionesSuccess: {
      return adapter.addAll(action.payload.recepciones, {
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

export const getRecepcionesLoading = (state: State) => state.loading;
export const getRecepcionesLoaded = (state: State) => state.loaded;
export const getRecepcionesFilter = (state: State) => state.filter;
export const getRecepcionesSearchTerm = (state: State) => state.searchTerm;
