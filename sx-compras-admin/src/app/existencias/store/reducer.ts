import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { Periodo } from 'app/_core/models/periodo';
import { Existencia } from '../models';

import { ExistenciaActionTypes, ExistenciaActions } from './actions';

import * as _ from 'lodash';

export const RECIBOS_PERIODO_KEY = 'sx.compras.existencia.periodo';

export const FEATURE_STORE_NAME = 'existencias';

export interface State extends EntityState<Existencia> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<Existencia> = createEntityAdapter<
  Existencia
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.mesActual()
});

export function reducer(
  state = initialState,
  action: ExistenciaActions
): State {
  switch (action.type) {
    case ExistenciaActionTypes.LoadExistencias:
    case ExistenciaActionTypes.UpdateExistencia: {
      return {
        ...state,
        loading: true
      };
    }
    case ExistenciaActionTypes.UpdateExistenciaFail:
    case ExistenciaActionTypes.LoadExistenciasFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ExistenciaActionTypes.LoadExistenciasSuccess: {
      return adapter.addAll(action.payload.existencias, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ExistenciaActionTypes.UpdateExistenciaSuccess: {
      return adapter.upsertOne(action.payload.existencia, {
        ...state,
        loading: false
      });
    }

    case ExistenciaActionTypes.UpsertExistencia: {
      return adapter.upsertOne(action.payload.existencia, {
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

export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;

export const getExistenciasState = createFeatureSelector<State>(
  FEATURE_STORE_NAME
);
