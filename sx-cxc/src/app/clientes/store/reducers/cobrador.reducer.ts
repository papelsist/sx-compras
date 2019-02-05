import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  CobradorActionTypes,
  CobradorActions
} from '../actions/cobrador.actions';

import { Cobrador } from '../../models';

export interface State extends EntityState<Cobrador> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<Cobrador> = createEntityAdapter<Cobrador>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(state = initialState, action: CobradorActions): State {
  switch (action.type) {
    case CobradorActionTypes.CreateCobrador:
    case CobradorActionTypes.UpdateCobrador:
    case CobradorActionTypes.DeleteCobrador:
    case CobradorActionTypes.LoadCobradores: {
      return {
        ...state,
        loading: true
      };
    }

    case CobradorActionTypes.CreateCobradorFail:
    case CobradorActionTypes.DeleteCobradorFail:
    case CobradorActionTypes.UpdateCobradorFail:
    case CobradorActionTypes.LoadCobradoresFail: {
      return {
        ...state,
        loading: false
      };
    }

    case CobradorActionTypes.LoadCobradoresSuccess: {
      return adapter.addAll(action.payload.cobradores, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CobradorActionTypes.UpdateCobradorSuccess:
    case CobradorActionTypes.CreateCobradorSuccess: {
      return adapter.upsertOne(action.payload.cobrador, {
        ...state,
        loading: false
      });
    }

    case CobradorActionTypes.DeleteCobradorSuccess: {
      return adapter.removeOne(action.payload.cobrador.id, {
        ...state,
        loading: false
      });
    }
  }
  return state;
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getCobradoresLoaded = (state: State) => state.loaded;
export const getCobradoresLoading = (state: State) => state.loading;
