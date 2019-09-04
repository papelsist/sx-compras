import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { NotaDeCargo } from '../../models';

import {
  NotaDeCargoActions,
  NotaDeCargoActionTypes
} from '../actions/nota-de-cargo.actions';

function sortByFolio(a: NotaDeCargo, b: NotaDeCargo): number {
  return b.folio > a.folio ? 1 : b.folio <= a.folio ? -1 : 0;
}

export interface State extends EntityState<NotaDeCargo> {
  loading: boolean;
  term: string;
}

export const adapter: EntityAdapter<NotaDeCargo> = createEntityAdapter<
  NotaDeCargo
>({ sortComparer: sortByFolio });

export const initialState: State = adapter.getInitialState({
  loading: false,
  term: ''
});

export function reducer(
  state = initialState,
  action: NotaDeCargoActions
): State {
  switch (action.type) {
    case NotaDeCargoActionTypes.GenerarNotasPorIntereses:
    case NotaDeCargoActionTypes.DeleteNotaDeCargo:
    case NotaDeCargoActionTypes.UpdateNotaDeCargo:
    case NotaDeCargoActionTypes.CreateNotaDeCargo:
    case NotaDeCargoActionTypes.LoadNotasDeCargo: {
      return {
        ...state,
        loading: true
      };
    }

    case NotaDeCargoActionTypes.GenerarNotasPorInteresesFail:
    case NotaDeCargoActionTypes.DeleteNotaDeCargoFail:
    case NotaDeCargoActionTypes.UpdateNotaDeCargoFail:
    case NotaDeCargoActionTypes.CreateNotaDeCargoFail:
    case NotaDeCargoActionTypes.LoadNotasDeCargoFail: {
      return {
        ...state,
        loading: false
      };
    }

    case NotaDeCargoActionTypes.LoadNotasDeCargoSuccess: {
      return adapter.addAll(action.payload.notas, {
        ...state,
        loading: false
      });
    }

    case NotaDeCargoActionTypes.CreateNotaDeCargoSuccess: {
      const nota = action.payload.nota;
      return adapter.addOne(nota, {
        ...state,
        loading: false
      });
    }

    case NotaDeCargoActionTypes.UpdateNotaDeCargoSuccess: {
      const nota = action.payload.nota;
      return adapter.upsertOne(nota, {
        ...state,
        loading: false
      });
    }

    case NotaDeCargoActionTypes.DeleteNotaDeCargoSuccess: {
      const nota = action.payload.nota;
      return adapter.removeOne(nota.id, {
        ...state,
        loading: false
      });
    }

    case NotaDeCargoActionTypes.SetNotasDeCargoSearchTerm: {
      return {
        ...state,
        term: action.payload.term
      };
    }

    case NotaDeCargoActionTypes.UpsertNotaDeCargo: {
      const nota = action.payload.nota;
      return adapter.upsertOne(nota, {
        ...state
      });
    }

    case NotaDeCargoActionTypes.GenerarNotasPorInteresesSuccess: {
      const notas = action.payload.notas;
      return adapter.upsertMany(notas, {
        ...state,
        loading: false
      });
    }

    default:
      return state;
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getLoading = (state: State) => state.loading;
export const getSearchTerm = (state: State) => state.term;
