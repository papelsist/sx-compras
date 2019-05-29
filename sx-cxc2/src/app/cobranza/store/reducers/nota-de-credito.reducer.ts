import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { NotaDeCredito, Cartera } from '../../models';

import {
  NotaDeCreditoActions,
  NotaDeCreditoActionTypes
} from '../actions/nota-de-credito.actions';

export interface State extends EntityState<NotaDeCredito> {
  loading: boolean;
  loaded: boolean;
  cartera: Cartera;
}

export const adapter: EntityAdapter<NotaDeCredito> = createEntityAdapter<
  NotaDeCredito
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  cartera: undefined
});

export function reducer(
  state = initialState,
  action: NotaDeCreditoActions
): State {
  switch (action.type) {
    case NotaDeCreditoActionTypes.DeleteNotaDeCredito:
    case NotaDeCreditoActionTypes.UpdateNotaDeCredito:
    case NotaDeCreditoActionTypes.CreateNotaDeCredito:
    case NotaDeCreditoActionTypes.LoadNotasDeCredito: {
      return {
        ...state,
        loading: true
      };
    }

    case NotaDeCreditoActionTypes.DeleteNotaDeCreditoFail:
    case NotaDeCreditoActionTypes.UpdateNotaDeCreditoFail:
    case NotaDeCreditoActionTypes.CreateNotaDeCreditoFail:
    case NotaDeCreditoActionTypes.LoadNotasDeCreditoFail: {
      return {
        ...state,
        loading: false
      };
    }

    case NotaDeCreditoActionTypes.LoadNotasDeCreditoSuccess: {
      return adapter.addAll(action.payload.notas, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case NotaDeCreditoActionTypes.CreateNotaDeCreditoSuccess: {
      const nota = action.payload.nota;
      return adapter.addOne(nota, {
        ...state,
        loading: false
      });
    }

    case NotaDeCreditoActionTypes.UpdateNotaDeCreditoSuccess: {
      const nota = action.payload.nota;
      return adapter.upsertOne(nota, {
        ...state,
        loading: false
      });
    }

    case NotaDeCreditoActionTypes.DeleteNotaDeCreditoSuccess: {
      const nota = action.payload.nota;
      return adapter.removeOne(nota.id, {
        ...state,
        loading: false
      });
    }

    case NotaDeCreditoActionTypes.UpsertNotaDeCredito: {
      const nota = action.payload.nota;
      return adapter.upsertOne(nota, {
        ...state
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
export const getLoaded = (state: State) => state.loaded;
export const getCartera = (state: State) => state.cartera;
