import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { NotaDeCredito } from 'app/cobranza/models';

import {
  DevolucionActions,
  DevolucionActionTypes
} from '../actions/devolucion.actions';

export interface State extends EntityState<NotaDeCredito> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<NotaDeCredito> = createEntityAdapter<
  NotaDeCredito
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: DevolucionActions
): State {
  switch (action.type) {
    case DevolucionActionTypes.DeleteDevolucion:
    case DevolucionActionTypes.UpdateDevolucion:
    case DevolucionActionTypes.CreateDevolucion:
    case DevolucionActionTypes.LoadDevoluciones: {
      return {
        ...state,
        loading: true
      };
    }

    case DevolucionActionTypes.DeleteDevolucionFail:
    case DevolucionActionTypes.UpdateDevolucionFail:
    case DevolucionActionTypes.CreateDevolucionFail:
    case DevolucionActionTypes.LoadDevolucionesFail: {
      return {
        ...state,
        loading: false
      };
    }

    case DevolucionActionTypes.LoadDevolucionesSuccess: {
      return adapter.addAll(action.payload.devoluciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case DevolucionActionTypes.CreateDevolucionSuccess: {
      const devolucion = action.payload.devolucion;
      return adapter.addOne(devolucion, {
        ...state,
        loading: false
      });
    }

    case DevolucionActionTypes.UpdateDevolucionSuccess: {
      const devolucion = action.payload.devolucion;
      return adapter.upsertOne(devolucion, {
        ...state,
        loading: false
      });
    }

    case DevolucionActionTypes.DeleteDevolucionSuccess: {
      const devolucion = action.payload.devolucion;
      return adapter.removeOne(devolucion.id, {
        ...state,
        loading: false
      });
    }

    case DevolucionActionTypes.UpsertDevolucion: {
      const devolucion = action.payload.devolucion;
      return adapter.upsertOne(devolucion, {
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
