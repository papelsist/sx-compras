import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../models';
import {
  RequisicionesDeMaterialActions,
  RequisicionesDeMaterialActionTypes
} from './actions';
import { createFeatureSelector } from '@ngrx/store';

export const REQUISICION_MATERIAL_PERIODO_KEY =
  'sx.compras.requisiciones-material.periodo';

export const FEATURE_STORE_NAME = 'requisiciones-de-material';

export interface State extends EntityState<RequisicionDeMaterial> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<
  RequisicionDeMaterial
> = createEntityAdapter<RequisicionDeMaterial>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(
    REQUISICION_MATERIAL_PERIODO_KEY,
    Periodo.fromNow(90)
  )
});

export function reducer(
  state = initialState,
  action: RequisicionesDeMaterialActions
): State {
  switch (action.type) {
    case RequisicionesDeMaterialActionTypes.SetPeriodo: {
      const periodo = action.payload.periodo;
      return {
        ...state,
        periodo
      };
    }
    case RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterial:
    case RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterial:
    case RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterial:
    case RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterial:
    case RequisicionesDeMaterialActionTypes.LoadRequisiciones: {
      return {
        ...state,
        loading: true
      };
    }

    case RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialFail:
    case RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialFail:
    case RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterialFail:
    case RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialFail:
    case RequisicionesDeMaterialActionTypes.LoadRequisicionesFail: {
      return {
        ...state,
        loading: false
      };
    }
    case RequisicionesDeMaterialActionTypes.LoadRequisicionesSuccess: {
      return adapter.addAll(action.payload.requisiciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialSuccess: {
      return adapter.addOne(action.payload.requisicion, {
        ...state,
        loading: false
      });
    }

    case RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialSuccess:
    case RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterialSuccess: {
      return adapter.upsertOne(action.payload.requisicion, {
        ...state,
        loading: false
      });
    }

    case RequisicionesDeMaterialActionTypes.UpsertRequisicion: {
      return adapter.upsertOne(action.payload.requisicion, {
        ...state
      });
    }

    case RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialSuccess: {
      return adapter.removeOne(action.payload.requisicion.id, {
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

export const getRequisicionesState = createFeatureSelector<State>(
  FEATURE_STORE_NAME
);
