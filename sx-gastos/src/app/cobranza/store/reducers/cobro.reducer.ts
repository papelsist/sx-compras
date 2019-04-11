import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CobroActions, CobroActionTypes } from '../actions/cobro.actions';
import { Cobro } from '../../models';

import * as moment from 'moment';

export interface State extends EntityState<Cobro> {
  loading: boolean;
  loaded: boolean;
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
  term: ''
});

export function reducer(state = initialState, action: CobroActions): State {
  switch (action.type) {
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

    case CobroActionTypes.UpsertCobro: {
      return adapter.upsertOne(action.payload.cobro, {
        ...state
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

export const getCobrosLoading = (state: State) => state.loading;
export const getCobrosLoaded = (state: State) => state.loaded;
export const getCobrosSearchTerm = (state: State) => state.term;
