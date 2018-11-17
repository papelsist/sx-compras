import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Comision } from '../../models';

import {
  ComisionActions,
  ComisionActionTypes
} from '../actions/comision.actions';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<Comision> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export const adapter: EntityAdapter<Comision> = createEntityAdapter<Comision>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(30),
  term: ''
});

export function reducer(state = initialState, action: ComisionActions): State {
  switch (action.type) {
    case ComisionActionTypes.SetComisionesFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case ComisionActionTypes.DeleteComision:
    case ComisionActionTypes.UpdateComision:
    case ComisionActionTypes.CreateComision:
    case ComisionActionTypes.LoadComisiones: {
      return {
        ...state,
        loading: true
      };
    }

    case ComisionActionTypes.ComisionError: {
      return {
        ...state,
        loading: false
      };
    }

    case ComisionActionTypes.LoadComisionesSuccess: {
      return adapter.addAll(action.payload.comisiones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ComisionActionTypes.UpdateComisionSuccess:
    case ComisionActionTypes.CreateComisionSuccess: {
      const comision = action.payload.comision;
      return adapter.upsertOne(comision, {
        ...state,
        loading: false
      });
    }

    case ComisionActionTypes.DeleteComisionSuccess: {
      return adapter.removeOne(action.payload.comision.id, {
        ...state,
        loading: false
      });
    }

    case ComisionActionTypes.UpsertComision: {
      return adapter.upsertOne(action.payload.comision, {
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

export const getComisionesLoading = (state: State) => state.loading;
export const getComisionesLoaded = (state: State) => state.loaded;
export const getComisionesFilter = (state: State) => state.filter;
export const getComisionesSearchTerm = (state: State) => state.term;
