import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Inversion } from '../../models/inversion';
import { TraspasosFilter } from '../../models/traspaso';
import {
  InversionActions,
  InversionActionTypes
} from '../actions/inversion.actions';
import { Periodo } from 'app/_core/models/periodo';

export function createInversionFilter(): TraspasosFilter {
  const { fechaInicial, fechaFinal } = Periodo.mesActual();
  const registros = 100;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}

export interface State extends EntityState<Inversion> {
  loading: boolean;
  loaded: boolean;
  filter: TraspasosFilter;
  term: string;
}

export const adapter: EntityAdapter<Inversion> = createEntityAdapter<
  Inversion
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createInversionFilter(),
  term: ''
});

export function reducer(state = initialState, action: InversionActions): State {
  switch (action.type) {
    case InversionActionTypes.SetInversionesFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case InversionActionTypes.SetInversionesSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case InversionActionTypes.DeleteInversion:
    case InversionActionTypes.UpdateInversion:
    case InversionActionTypes.CreateInversion:
    case InversionActionTypes.LoadInversiones: {
      return {
        ...state,
        loading: true
      };
    }

    case InversionActionTypes.InversionError: {
      return {
        ...state,
        loading: false
      };
    }

    case InversionActionTypes.LoadInversionesSuccess: {
      return adapter.addAll(action.payload.inversiones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case InversionActionTypes.UpdateInversionSuccess:
    case InversionActionTypes.CreateInversionSuccess: {
      const inversion = action.payload.inversion;
      return adapter.upsertOne(inversion, {
        ...state,
        loading: false
      });
    }

    case InversionActionTypes.DeleteInversionSuccess: {
      return adapter.removeOne(action.payload.inversion.id, {
        ...state,
        loading: false
      });
    }

    case InversionActionTypes.UpsertInversion: {
      return adapter.upsertOne(action.payload.inversion, {
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

export const getInversionesLoading = (state: State) => state.loading;
export const getInversionesLoaded = (state: State) => state.loaded;
export const getInversionesFilter = (state: State) => state.filter;
export const getInversionesSearchTerm = (state: State) => state.term;
