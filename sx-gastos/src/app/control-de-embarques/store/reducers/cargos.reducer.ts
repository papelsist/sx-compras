import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { FacturistaCargo } from '../../model';
import { CargosActions, CargosActionTypes } from '../actions/cargos.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<FacturistaCargo> {
  loading: boolean;
  loaded: boolean;
  filter: { periodo: Periodo };
  term: string;
}

export const adapter: EntityAdapter<FacturistaCargo> = createEntityAdapter<
  FacturistaCargo
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: { periodo: Periodo.fromNow(200) },
  term: ''
});

export function reducer(state = initialState, action: CargosActions): State {
  switch (action.type) {
    case CargosActionTypes.SetCargosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case CargosActionTypes.SetCargosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case CargosActionTypes.DeleteCargo:
    case CargosActionTypes.UpdateCargo:
    case CargosActionTypes.CreateCargo:
    case CargosActionTypes.LoadCargos: {
      return {
        ...state,
        loading: true
      };
    }

    case CargosActionTypes.DeleteCargoFail:
    case CargosActionTypes.UpdateCargoFail:
    case CargosActionTypes.CreateCargoFail:
    case CargosActionTypes.LoadCargosFail: {
      return {
        ...state,
        loading: false
      };
    }

    case CargosActionTypes.LoadCargosSuccess: {
      return adapter.addAll(action.payload.cargos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CargosActionTypes.UpdateCargoSuccess:
    case CargosActionTypes.CreateCargoSuccess: {
      return adapter.upsertOne(action.payload.cargo, {
        ...state,
        loading: false
      });
    }

    case CargosActionTypes.DeleteCargoSuccess: {
      return adapter.removeOne(action.payload.cargo.id, {
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

export const getCargosLoading = (state: State) => state.loading;
export const getCargosLoaded = (state: State) => state.loaded;
export const getCargosFilter = (state: State) => state.filter;
export const getCargosSearchTerm = (state: State) => state.term;
