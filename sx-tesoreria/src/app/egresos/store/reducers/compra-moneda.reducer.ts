import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CompraMoneda } from '../../models';

import {
  CompraMonedaActions,
  CompraMonedaActionTypes
} from '../actions/compra-moneda.actions';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<CompraMoneda> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export const adapter: EntityAdapter<CompraMoneda> = createEntityAdapter<
  CompraMoneda
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(30),
  term: ''
});

export function reducer(
  state = initialState,
  action: CompraMonedaActions
): State {
  switch (action.type) {
    case CompraMonedaActionTypes.SetCompraMonedasFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case CompraMonedaActionTypes.DeleteCompraMoneda:
    case CompraMonedaActionTypes.UpdateCompraMoneda:
    case CompraMonedaActionTypes.CreateCompraMoneda:
    case CompraMonedaActionTypes.LoadCompraMonedas: {
      return {
        ...state,
        loading: true
      };
    }

    case CompraMonedaActionTypes.CompraMonedaError: {
      return {
        ...state,
        loading: false
      };
    }

    case CompraMonedaActionTypes.LoadCompraMonedasSuccess: {
      return adapter.addAll(action.payload.compras, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CompraMonedaActionTypes.UpdateCompraMonedaSuccess:
    case CompraMonedaActionTypes.CreateCompraMonedaSuccess: {
      const compra = action.payload.compra;
      return adapter.upsertOne(compra, {
        ...state,
        loading: false
      });
    }

    case CompraMonedaActionTypes.DeleteCompraMonedaSuccess: {
      return adapter.removeOne(action.payload.compra.id, {
        ...state,
        loading: false
      });
    }

    case CompraMonedaActionTypes.UpsertCompraMoneda: {
      return adapter.upsertOne(action.payload.compra, {
        ...state,
        loading: false
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

export const getCompraMonedasLoading = (state: State) => state.loading;
export const getCompraMonedasLoaded = (state: State) => state.loaded;
export const getCompraMonedasFilter = (state: State) => state.filter;
export const getCompraMonedasSearchTerm = (state: State) => state.term;
