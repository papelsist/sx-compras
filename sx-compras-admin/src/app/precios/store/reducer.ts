import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { Periodo } from 'app/_core/models/periodo';
import { CambioDePrecio } from '../models';

import { CambioDePreciosActionTypes, CambioDePreciosActions } from './actions';

export const CAMBIOS_DE_PRECIO_PERIODO_KEY = 'sx.compras.requisiciones.periodo';

export const FEATURE_STORE_NAME = 'cambios-de-precio';

export interface State extends EntityState<CambioDePrecio> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<CambioDePrecio> = createEntityAdapter<
  CambioDePrecio
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(
    CAMBIOS_DE_PRECIO_PERIODO_KEY,
    Periodo.fromNow(90)
  )
});

export function reducer(
  state = initialState,
  action: CambioDePreciosActions
): State {
  switch (action.type) {
    case CambioDePreciosActionTypes.AplicarCambioDePrecios:
    case CambioDePreciosActionTypes.DeleteCambioDePrecio:
    case CambioDePreciosActionTypes.UpdateCambioDePrecio:
    case CambioDePreciosActionTypes.CreateCambioDePrecio:
    case CambioDePreciosActionTypes.LoadCambiosDePrecio: {
      return {
        ...state,
        loading: true
      };
    }

    case CambioDePreciosActionTypes.AplicarCambioDePreciosFail:
    case CambioDePreciosActionTypes.DeleteCambioDePrecioFail:
    case CambioDePreciosActionTypes.UpdateCambioDePrecioFail:
    case CambioDePreciosActionTypes.CreateCambioDePrecioFail:
    case CambioDePreciosActionTypes.LoadCambiosDePrecioFail: {
      return {
        ...state,
        loading: false
      };
    }
    case CambioDePreciosActionTypes.LoadCambiosDePrecioSuccess: {
      return adapter.addAll(action.payload.cambios, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CambioDePreciosActionTypes.CreateCambioDePrecioSuccess: {
      return adapter.addOne(action.payload.cambio, {
        ...state,
        loading: false
      });
    }

    case CambioDePreciosActionTypes.AplicarCambioDePreciosSuccess:
    case CambioDePreciosActionTypes.UpdateCambioDePrecioSuccess: {
      return adapter.upsertOne(action.payload.cambio, {
        ...state,
        loading: false
      });
    }

    case CambioDePreciosActionTypes.UpsertCambioDePrecio: {
      return adapter.upsertOne(action.payload.cambio, {
        ...state
      });
    }

    case CambioDePreciosActionTypes.DeleteCambioDePrecioSuccess: {
      return adapter.removeOne(action.payload.cambio.id, {
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

export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;

export const getCambiosDePrecioState = createFeatureSelector<State>(
  FEATURE_STORE_NAME
);
