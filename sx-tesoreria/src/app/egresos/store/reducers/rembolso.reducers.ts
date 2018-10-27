import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Rembolso, RembolsosFilter, createRembolsoFilter } from '../../models';
import {
  RembolsoActions,
  RembolsoActionTypes
} from '../actions/rembolso.actions';

export interface State extends EntityState<Rembolso> {
  loading: boolean;
  loaded: boolean;
  filter: RembolsosFilter;
  term: string;
}

export const adapter: EntityAdapter<Rembolso> = createEntityAdapter<Rembolso>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createRembolsoFilter(),
  term: ''
});

export function reducer(state = initialState, action: RembolsoActions): State {
  switch (action.type) {
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

    case RembolsoActionTypes.GenerarChequeRembolso:
    case RembolsoActionTypes.CancelarChequeRembolso:
    case RembolsoActionTypes.CancelarPagoRembolso:
    case RembolsoActionTypes.PagoRembolso:
    case RembolsoActionTypes.LoadRembolsos: {
      return {
        ...state,
        loading: true
      };
    }

    case RembolsoActionTypes.GenerarChequeRembolsoFail:
    case RembolsoActionTypes.CancelarChequeRembolsoFail:
    case RembolsoActionTypes.CancelarPagoRembolsoFail:
    case RembolsoActionTypes.PagoRembolsoFail:
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

    case RembolsoActionTypes.GenerarChequeRembolsoSuccess:
    case RembolsoActionTypes.CancelarChequeRembolsoSuccess:
    case RembolsoActionTypes.CancelarPagoRembolsoSuccess:
    case RembolsoActionTypes.PagoRembolsoSuccess: {
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
export const getRembolsosFilter = (state: State) => state.filter;
export const getRembolsosSearchTerm = (state: State) => state.term;
