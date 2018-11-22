import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { DevolucionCliente } from '../../models';

import {
  DevolucionClienteActions,
  DevolucionClienteActionTypes
} from '../actions/devolucion-cliente.actions';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<DevolucionCliente> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export const adapter: EntityAdapter<DevolucionCliente> = createEntityAdapter<
  DevolucionCliente
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(90),
  term: ''
});

export function reducer(
  state = initialState,
  action: DevolucionClienteActions
): State {
  switch (action.type) {
    case DevolucionClienteActionTypes.SetDevolucionClientesFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case DevolucionClienteActionTypes.DeleteDevolucionCliente:
    case DevolucionClienteActionTypes.CreateDevolucionCliente:
    case DevolucionClienteActionTypes.LoadDevoluciones: {
      return {
        ...state,
        loading: true
      };
    }

    case DevolucionClienteActionTypes.DevolucionClienteError: {
      return {
        ...state,
        loading: false
      };
    }

    case DevolucionClienteActionTypes.LoadDevolucionesSuccess: {
      return adapter.addAll(action.payload.devoluciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case DevolucionClienteActionTypes.DeleteDevolucionClienteSuccess: {
      return adapter.removeOne(action.payload.devolucion.id, {
        ...state,
        loading: false
      });
    }

    case DevolucionClienteActionTypes.CreateDevolucionClienteSuccess: {
      return adapter.upsertOne(action.payload.devolucion, {
        ...state,
        loading: false
      });
    }

    case DevolucionClienteActionTypes.UpsertDevolucionCliente: {
      return adapter.upsertOne(action.payload.devolucion, {
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

export const getDevolucionClienteLoading = (state: State) => state.loading;
export const getDevolucionClienteLoaded = (state: State) => state.loaded;
export const getDevolucionClienteFilter = (state: State) => state.filter;
export const getDevolucionClienteSearchTerm = (state: State) => state.term;
