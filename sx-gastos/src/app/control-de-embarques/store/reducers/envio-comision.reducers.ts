import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  EnvioComision,
  EnviosFilter,
  createEnviosFilter,
  readFromLocalStorage
} from '../../model';
import {
  EnvioComisionActions,
  EnvioComisionActionTypes
} from '../actions/envio-comision.actions';

export interface State extends EntityState<EnvioComision> {
  loading: boolean;
  loaded: boolean;
  filter: EnviosFilter;
  term: string;
}

export const adapter: EntityAdapter<EnvioComision> = createEntityAdapter<
  EnvioComision
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: readFromLocalStorage(),
  term: ''
});

export function reducer(
  state = initialState,
  action: EnvioComisionActions
): State {
  switch (action.type) {
    case EnvioComisionActionTypes.SetEnviosComisionFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case EnvioComisionActionTypes.SetEnvioComisionSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case EnvioComisionActionTypes.GenerarComisiones:
    case EnvioComisionActionTypes.LoadEnvioComisiones: {
      return {
        ...state,
        loading: true
      };
    }
    case EnvioComisionActionTypes.GenerarComisionesFail:
    case EnvioComisionActionTypes.LoadEnvioComisionesFail: {
      return {
        ...state,
        loading: false
      };
    }

    case EnvioComisionActionTypes.LoadEnvioComisionesSuccess: {
      return adapter.addAll(action.payload.comisiones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case EnvioComisionActionTypes.GenerarComisionesSuccess: {
      return adapter.upsertMany(action.payload.comisiones, {
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

export const getEnvioComisionLoading = (state: State) => state.loading;
export const getEnvioComisionLoaded = (state: State) => state.loaded;
export const getEnvioComisionFilter = (state: State) => state.filter;
export const getEnvioComisionSearchTerm = (state: State) => state.term;
