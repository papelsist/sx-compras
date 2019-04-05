import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as fromRoot from 'app/store';

import { CobroActions, CobroActionTypes } from './cobro.actions';
import { Cobro, CobrosFilter, createCobrosFilter } from '../models';

import * as moment from 'moment';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends EntityState<Cobro> {
  loading: boolean;
  loaded: boolean;
  filter: CobrosFilter;
  term: string;
}

export function comparLastUpdate(row1: Cobro, row2: Cobro): number {
  const d1 = moment(row1.lastUpdated);
  const d2 = moment(row2.lastUpdated);
  return d1.isSameOrBefore(d2) ? 1 : -1;
}

export const adapter: EntityAdapter<Cobro> = createEntityAdapter<Cobro>({
  sortComparer: comparLastUpdate
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createCobrosFilter(),
  term: ''
});

export function reducer(state = initialState, action: CobroActions): State {
  switch (action.type) {
    case CobroActionTypes.SetCobrosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case CobroActionTypes.SetCobrosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case CobroActionTypes.LoadCobros: {
      return {
        ...state,
        loading: true
      };
    }

    case CobroActionTypes.LoadCobrosFail: {
      return {
        ...state,
        loading: false
      };
    }

    case CobroActionTypes.LoadCobrosSuccess: {
      return adapter.addAll(action.payload.cobros, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    default:
      return state;
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getCobrosState = createFeatureSelector<State>('cobros');

export const getCobrosEntities = createSelector(getCobrosState, selectEntities);

export const getAllCobros = createSelector(getCobrosState, selectAll);

export const getCobrosLoaded = createSelector(
  getCobrosState,
  (state: State) => state.loaded
);

export const getCobrosLoading = createSelector(
  getCobrosState,
  (state: State) => state.loading
);

export const getSelectedCobro = createSelector(
  getCobrosEntities,
  fromRoot.getRouterState,
  (entities, router): Cobro => {
    return router.state && entities[router.state.params.cobroId];
  }
);

export const getCobrosFilter = createSelector(
  getCobrosState,
  (state: State) => state.filter
);

export const getCobrosSearchTerm = createSelector(
  getCobrosState,
  (state: State) => state.term
);
