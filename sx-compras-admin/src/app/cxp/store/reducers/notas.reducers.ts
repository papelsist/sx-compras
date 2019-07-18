import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';
import { NotaActions, NotaActionTypes } from '../actions/notas.actions';
import { Periodo } from 'app/_core/models/periodo';

export const NotasPeriodoStoeKey = 'sx-compras.cxp.notas.periodo';

export interface State extends EntityState<NotaDeCreditoCxP> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
  searchTerm: string;
}

export const adapter: EntityAdapter<NotaDeCreditoCxP> = createEntityAdapter<
  NotaDeCreditoCxP
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(NotasPeriodoStoeKey),
  searchTerm: undefined
});

export function reducer(state = initialState, action: NotaActions): State {
  switch (action.type) {
    case NotaActionTypes.SetPeriodoDeNotas: {
      const periodo = action.payload.periodo;
      return {
        ...state,
        periodo
      };
    }
    case NotaActionTypes.SetSearchTerm: {
      const searchTerm = action.payload;
      return {
        ...state,
        searchTerm
      };
    }

    case NotaActionTypes.AplicarNota:
    case NotaActionTypes.DeleteNota:
    case NotaActionTypes.AddNota:
    case NotaActionTypes.LoadNotas: {
      return {
        ...state,
        loading: true
      };
    }

    case NotaActionTypes.DeleteNotaFail:
    case NotaActionTypes.UpdateNotaFail:
    case NotaActionTypes.AddNotaFail:
    case NotaActionTypes.LoadNotasFail: {
      return {
        ...state,
        loading: false
      };
    }
    case NotaActionTypes.LoadNotasSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case NotaActionTypes.AddNotaSuccess: {
      return adapter.addOne(action.payload, {
        ...state,
        loading: false
      });
    }

    case NotaActionTypes.UpdateNotaSuccess: {
      const compra = action.payload;
      return adapter.updateOne(
        {
          id: compra.id,
          changes: compra
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case NotaActionTypes.UpsertNota: {
      return adapter.upsertOne(action.payload.nota, {
        ...state,
        loading: false
      });
    }

    case NotaActionTypes.DeleteNotaSuccess: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    }

    case NotaActionTypes.ClearNotas: {
      return adapter.removeAll(state);
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

export const getNotasLoading = (state: State) => state.loading;
export const getNotasLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;
export const getSearchTerm = (state: State) => state.searchTerm;
