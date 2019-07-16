import * as _ from 'lodash';

import {
  RequisicionActionTypes,
  RequisicionActions
} from '../actions/requisicion.actions';

import { Requisicion } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

export const RequisicionesPeriodoStoeKey = 'sx-compras.requisiciones.periodo';

export interface RequisicionState {
  entities: { [id: string]: Requisicion };
  loaded: boolean;
  loading: boolean;
  periodo: Periodo;
}

export const initialState: RequisicionState = {
  entities: {},
  loaded: false,
  loading: false,
  periodo: Periodo.fromStorage(RequisicionesPeriodoStoeKey)
};

export function reducer(
  state = initialState,
  action: RequisicionActions
): RequisicionState {
  switch (action.type) {
    case RequisicionActionTypes.SetRequisicionPeriodo: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }
    case RequisicionActionTypes.LoadRequisiciones: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }
    case RequisicionActionTypes.LoadRequisicionesFail: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case RequisicionActionTypes.LoadRequisicionesSuccess: {
      const requisiciones = action.payload.requisiciones;
      const entities = _.keyBy(requisiciones, 'id');
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case RequisicionActionTypes.LOAD: {
      const requisicion = action.payload;
      const entities = {
        ...state.entities,
        [requisicion.id]: requisicion
      };
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }
    case RequisicionActionTypes.LOAD_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION:
    case RequisicionActionTypes.UPDATE_REQUISICION:
    case RequisicionActionTypes.CERRAR_REQUISICION: {
      return {
        ...state,
        loading: true
      };
    }
    case RequisicionActionTypes.SAVE_REQUISICION_FAIL:
    case RequisicionActionTypes.UPDATE_REQUISICION_FAIL:
    case RequisicionActionTypes.DELETE_REQUISICION_FAIL:
    case RequisicionActionTypes.CERRAR_REQUISICION_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION_SUCCESS:
    case RequisicionActionTypes.UPDATE_REQUISICION_SUCCESS:
    case RequisicionActionTypes.CERRAR_REQUISICION_SUCCESS: {
      const requisicion = action.payload;
      const entities = {
        ...state.entities,
        [requisicion.id]: requisicion
      };
      return {
        ...state,
        loading: false,
        entities
      };
    }

    // Delete
    case RequisicionActionTypes.DELETE_REQUISICION_SUCCESS: {
      const requisicion = action.payload;
      const { [requisicion.id]: result, ...entities } = state.entities;
      return {
        ...state,
        loading: false,
        entities
      };
    }
  }
  return state;
}

export const getPeriodo = (state: RequisicionState) => state.periodo;
export const getLoaded = (state: RequisicionState) => state.loaded;
export const getLoading = (state: RequisicionState) => state.loading;

export const getRequisicionLoaded = (state: RequisicionState) => state.loaded;
export const getRequisicionLoading = (state: RequisicionState) => state.loading;
export const getRequisicionEntities = (state: RequisicionState) =>
  state.entities;
