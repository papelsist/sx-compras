import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Rembolso, RembolsosFilter, createRembolsoFilter } from '../../model';
import {
  RembolsoActions,
  RembolsoActionTypes
} from '../actions/rembolso.actions';
import { Periodo } from 'app/_core/models/periodo';

export const REMBOLSOS_PERIODO_KEY = 'sx.gastos.facturas.periodo';

export interface State extends EntityState<Rembolso> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
  filter: RembolsosFilter;
  term: string;
}

export function sortByIdDesc(a: Rembolso, b: Rembolso): number {
  return b.id > a.id ? 1 : b.id <= a.id ? -1 : 0;
}

export const adapter: EntityAdapter<Rembolso> = createEntityAdapter<Rembolso>({
  sortComparer: sortByIdDesc
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromNow(30),
  filter: createRembolsoFilter(),
  term: ''
});

export function reducer(state = initialState, action: RembolsoActions): State {
  switch (action.type) {
    case RembolsoActionTypes.SetRembolsosPeriodo: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }
    case RembolsoActionTypes.SetRembolsosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case RembolsoActionTypes.SetRembolsosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case RembolsoActionTypes.CopiarRembolso:
    case RembolsoActionTypes.DeleteRembolso:
    case RembolsoActionTypes.SaveRembolso:
    case RembolsoActionTypes.LoadRembolsos: {
      return {
        ...state,
        loading: true
      };
    }

    case RembolsoActionTypes.CopiarRembolsoFail:
    case RembolsoActionTypes.DeleteRembolsoFail:
    case RembolsoActionTypes.SaveRembolsoFail:
    case RembolsoActionTypes.UpdateRembolsoFail:
    case RembolsoActionTypes.LoadRembolsosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case RembolsoActionTypes.LoadRembolsosSuccess: {
      return adapter.addAll(action.payload.rembolsos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case RembolsoActionTypes.UpdateRembolsoSuccess: {
      const rembolso = action.payload.rembolso;
      return adapter.updateOne(
        {
          id: rembolso.id,
          changes: rembolso
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case RembolsoActionTypes.UpsertRembolso: {
      return adapter.upsertOne(action.payload.rembolso, {
        ...state
      });
    }

    case RembolsoActionTypes.SaveRembolsoSuccess: {
      const rembolso = action.payload.rembolso;
      return adapter.addOne(rembolso, {
        ...state,
        loading: false
      });
    }

    case RembolsoActionTypes.DeleteRembolsoSuccess: {
      const rembolso = action.payload.rembolso;
      return adapter.removeOne(rembolso.id, {
        ...state,
        loading: false
      });
    }
    case RembolsoActionTypes.CopiarRembolsoSuccess: {
      return adapter.addOne(action.payload.rembolso, {
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

export const getRembolsosLoading = (state: State) => state.loading;
export const getRembolsosLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;
export const getRembolsosFilter = (state: State) => state.filter;
export const getRembolsosSearchTerm = (state: State) => state.term;
