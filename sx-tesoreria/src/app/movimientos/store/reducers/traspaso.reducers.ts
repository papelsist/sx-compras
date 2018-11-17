import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Traspaso, TraspasosFilter } from '../../models/traspaso';
import {
  TraspasoActions,
  TraspasoActionTypes
} from '../actions/traspaso.actions';
import { Periodo } from 'app/_core/models/periodo';

export function createTraspasoFilter(): TraspasosFilter {
  const { fechaInicial, fechaFinal } = Periodo.mesActual();
  const registros = 100;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}

export interface State extends EntityState<Traspaso> {
  loading: boolean;
  loaded: boolean;
  filter: TraspasosFilter;
  term: string;
}

export const adapter: EntityAdapter<Traspaso> = createEntityAdapter<Traspaso>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createTraspasoFilter(),
  term: ''
});

export function reducer(state = initialState, action: TraspasoActions): State {
  switch (action.type) {
    case TraspasoActionTypes.SetTraspasosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case TraspasoActionTypes.SetTraspasosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case TraspasoActionTypes.DeleteTraspaso:
    case TraspasoActionTypes.UpdateTraspaso:
    case TraspasoActionTypes.CreateTraspaso:
    case TraspasoActionTypes.LoadTraspasos: {
      return {
        ...state,
        loading: true
      };
    }

    case TraspasoActionTypes.TraspasoError: {
      return {
        ...state,
        loading: false
      };
    }

    case TraspasoActionTypes.LoadTraspasosSuccess: {
      return adapter.addAll(action.payload.traspasos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case TraspasoActionTypes.UpdateTraspasoSuccess:
    case TraspasoActionTypes.CreateTraspasoSuccess: {
      const traspaso = action.payload.traspaso;
      return adapter.upsertOne(traspaso, {
        ...state,
        loading: false
      });
    }

    case TraspasoActionTypes.DeleteTraspasoSuccess: {
      return adapter.removeOne(action.payload.traspaso.id, {
        ...state,
        loading: false
      });
    }

    case TraspasoActionTypes.UpsertTraspaso: {
      return adapter.upsertOne(action.payload.traspaso, {
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

export const getTraspasosLoading = (state: State) => state.loading;
export const getTraspasosLoaded = (state: State) => state.loaded;
export const getTraspasosFilter = (state: State) => state.filter;
export const getTraspasosSearchTerm = (state: State) => state.term;
