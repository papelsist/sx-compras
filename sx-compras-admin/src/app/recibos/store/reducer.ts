import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { Periodo } from 'app/_core/models/periodo';
import { Recibo } from '../models';

import { ReciboActionTypes, RecibosActions } from './actions';

import * as _ from 'lodash';

export const RECIBOS_PERIODO_KEY = 'sx.compras.recibos.periodo';

export const FEATURE_STORE_NAME = 'recibos';

export interface State extends EntityState<Recibo> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<Recibo> = createEntityAdapter<Recibo>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(RECIBOS_PERIODO_KEY, Periodo.fromNow(30)),
  disponibles: undefined,
  disponiblesLoaded: false
});

export function reducer(state = initialState, action: RecibosActions): State {
  switch (action.type) {
    case ReciboActionTypes.SetPeriodo: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }

    case ReciboActionTypes.QuitarRequisicionRecibo:
    case ReciboActionTypes.AsignarRequisicionRecibo:
    case ReciboActionTypes.LoadRecibos:
    case ReciboActionTypes.DeleteRecibo:
    case ReciboActionTypes.UpdateRecibo: {
      return {
        ...state,
        loading: true
      };
    }

    case ReciboActionTypes.QuitarRequisicionReciboFail:
    case ReciboActionTypes.DeleteReciboFail:
    case ReciboActionTypes.UpdateReciboFail:
    case ReciboActionTypes.LoadRecibosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ReciboActionTypes.LoadRecibosSuccess: {
      return adapter.addAll(action.payload.recibos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ReciboActionTypes.UpdateReciboSuccess: {
      return adapter.upsertOne(action.payload.recibo, {
        ...state,
        loading: false
      });
    }

    case ReciboActionTypes.UpsertRecibo: {
      return adapter.upsertOne(action.payload.recibo, {
        ...state
      });
    }

    case ReciboActionTypes.QuitarRequisicionReciboSuccess: {
      const recibo = action.payload.recibo;
      adapter.removeOne(recibo.id, state); // small fix porque no quita la requisicion
      return adapter.upsertOne(action.payload.recibo, {
        ...state,
        loading: false
      });
    }

    case ReciboActionTypes.DeleteReciboSuccess: {
      return adapter.removeOne(action.payload.recibo.id, {
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

export const getRecibosState = createFeatureSelector<State>(FEATURE_STORE_NAME);
