import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { GastoDet } from '../../model';
import { GastoActions, GastoActionTypes } from '../actions/gasto.actions';

export interface State extends EntityState<GastoDet> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<GastoDet> = createEntityAdapter<GastoDet>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(state = initialState, action: GastoActions): State {
  switch (action.type) {
    case GastoActionTypes.ProrratearPartida:
    case GastoActionTypes.DeleteGasto:
    case GastoActionTypes.UpdateGasto:
    case GastoActionTypes.CreateGasto:
    case GastoActionTypes.LoadGastos: {
      return {
        ...state,
        loading: true
      };
    }
    case GastoActionTypes.ProrratearPartidaFail:
    case GastoActionTypes.DeleteGastoFail:
    case GastoActionTypes.CreateGastoFail:
    case GastoActionTypes.UpdateGastoFail:
    case GastoActionTypes.LoadGastosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case GastoActionTypes.LoadGastosSuccess: {
      return adapter.addAll(action.payload.gastos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case GastoActionTypes.CreateGastoSuccess: {
      return adapter.addOne(action.payload.gasto, {
        ...state,
        loading: false
      });
    }

    case GastoActionTypes.UpdateGastoSuccess: {
      const gasto = action.payload.gasto;
      return adapter.upsertOne(gasto, {
        ...state,
        loading: false
      });
    }

    case GastoActionTypes.ClearGastos: {
      return adapter.removeAll(state);
    }
    case GastoActionTypes.DeleteGastoSuccess: {
      return adapter.removeOne(action.payload.gastoId, {
        ...state,
        loading: false
      });
    }

    case GastoActionTypes.ProrratearPartidaSuccess: {
      const ss = adapter.removeAll(state);
      return adapter.addMany(action.payload.gastos, {
        ...ss,
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

export const getGastosLoading = (state: State) => state.loading;
export const getGastosLoaded = (state: State) => state.loaded;
