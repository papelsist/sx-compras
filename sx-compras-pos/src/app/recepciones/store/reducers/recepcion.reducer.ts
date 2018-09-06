import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';
import {
  RecepcionDeCompraActions,
  RecepcionDeCompraActionTypes
} from '../actions/recepcion.actions';

export interface State extends EntityState<RecepcionDeCompra> {
  loading: boolean;
  loaded: boolean;
  selected: string[];
}

export const adapter: EntityAdapter<RecepcionDeCompra> = createEntityAdapter<
  RecepcionDeCompra
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  selected: []
});

export function reducer(
  state = initialState,
  action: RecepcionDeCompraActions
): State {
  switch (action.type) {
    case RecepcionDeCompraActionTypes.DeleteRecepcionDeCompra:
    case RecepcionDeCompraActionTypes.UpdateRecepcionDeCompra:
    case RecepcionDeCompraActionTypes.AddRecepcionDeCompra:
    case RecepcionDeCompraActionTypes.LoadComs: {
      return {
        ...state,
        loading: true
      };
    }

    case RecepcionDeCompraActionTypes.DeleteRecepcionDeCompraFail:
    case RecepcionDeCompraActionTypes.UpdateRecepcionDeCompraFail:
    case RecepcionDeCompraActionTypes.AddRecepcionDeCompraFail:
    case RecepcionDeCompraActionTypes.LoadComsFail: {
      return {
        ...state,
        loading: false
      };
    }

    case RecepcionDeCompraActionTypes.LoadComsSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case RecepcionDeCompraActionTypes.AddRecepcionDeCompraSuccess: {
      return adapter.addOne(action.payload, {
        ...state,
        loading: false
      });
    }

    case RecepcionDeCompraActionTypes.UpsertRecepcionDeCompra: {
      return adapter.upsertOne(action.payload.com, {
        ...state,
        loading: false
      });
    }
    case RecepcionDeCompraActionTypes.UpsertComs: {
      return adapter.upsertMany(action.payload, {
        ...state,
        loading: false
      });
    }

    case RecepcionDeCompraActionTypes.DeleteRecepcionDeCompraSuccess: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    }

    case RecepcionDeCompraActionTypes.ClearComs: {
      return adapter.removeAll(state);
    }

    case RecepcionDeCompraActionTypes.SetSelectedComs: {
      const selected = action.payload.selected;
      return {
        ...state,
        selected
      };
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

export const getComsLoading = (state: State) => state.loading;
export const getComsLoaded = (state: State) => state.loaded;
export const getSelected = (state: State) => state.selected;
