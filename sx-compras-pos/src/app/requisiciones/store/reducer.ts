import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../models';
import {
  RequisicionesDeMaterialActions,
  RequisicionesDeMaterialActionTypes
} from './store/actions';
import { createFeatureSelector } from '@ngrx/store';

export const REQUISICION_PERIODO_KEY = 'sx.compras.requisiciones.periodo';

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
  periodo: Periodo.fromStorage(REQUISICION_PERIODO_KEY)
});

export function reducer(
  state = initialState,
  action: RequisicionesDeMaterialActions
): State {
  switch (action.type) {
    case RequisicionesDeMaterialActionTypes.LoadRequisiciones: {
      return {
        ...state,
        loading: true
      };
    }

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

const getLoading = (state: State) => state.loading;
const getLoaded = (state: State) => state.loaded;
const getPeriodo = (state: State) => state.periodo;

export const getRequisicionesState = createFeatureSelector<State>('requisiciones-de-material');

