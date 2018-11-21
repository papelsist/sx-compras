import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { PagoDeMorralla } from '../../models';

import {
  PagoDeMorrallaActions,
  PagoDeMorrallaActionTypes
} from '../actions/pago-morralla.actions';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<PagoDeMorralla> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export const adapter: EntityAdapter<PagoDeMorralla> = createEntityAdapter<
  PagoDeMorralla
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(90),
  term: ''
});

export function reducer(
  state = initialState,
  action: PagoDeMorrallaActions
): State {
  switch (action.type) {
    case PagoDeMorrallaActionTypes.SetPagoDeMorrallasFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case PagoDeMorrallaActionTypes.DeletePagoDeMorralla:
    case PagoDeMorrallaActionTypes.CreatePagarMorralla:
    case PagoDeMorrallaActionTypes.LoadPagoDeMorrallas: {
      return {
        ...state,
        loading: true
      };
    }

    case PagoDeMorrallaActionTypes.PagoDeMorrallaError: {
      return {
        ...state,
        loading: false
      };
    }

    case PagoDeMorrallaActionTypes.LoadPagoDeMorrallasSuccess: {
      return adapter.addAll(action.payload.pagos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case PagoDeMorrallaActionTypes.DeletePagoDeMorrallaSuccess: {
      return adapter.removeOne(action.payload.pago.id, {
        ...state,
        loading: false
      });
    }

    case PagoDeMorrallaActionTypes.CreatePagarMorrallaSuccess: {
      return adapter.upsertOne(action.payload.pago, {
        ...state,
        loading: false
      });
    }

    case PagoDeMorrallaActionTypes.UpsertPagoDeMorralla: {
      return adapter.upsertOne(action.payload.pago, {
        ...state
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

export const getPagoDeMorrallasLoading = (state: State) => state.loading;
export const getPagoDeMorrallasLoaded = (state: State) => state.loaded;
export const getPagoDeMorrallasFilter = (state: State) => state.filter;
export const getPagoDeMorrallasSearchTerm = (state: State) => state.term;
