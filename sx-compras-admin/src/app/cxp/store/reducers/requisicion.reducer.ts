import * as _ from 'lodash';

import {
  RequisicionActionTypes,
  RequisicionActions
} from '../actions/requisicion.actions';

import { Requisicion } from '../../model';

export interface RequisicionState {
  entities: { [id: string]: Requisicion };
  loaded: boolean;
  loading: boolean;
}

export const initialState: RequisicionState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: RequisicionActions
): RequisicionState {
  switch (action.type) {
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
    case RequisicionActionTypes.UPDATE_REQUISICION: {
      return {
        ...state,
        loading: true
      };
    }
    case RequisicionActionTypes.SAVE_REQUISICION_FAIL:
    case RequisicionActionTypes.UPDATE_REQUISICION_FAIL:
    case RequisicionActionTypes.DELETE_REQUISICION_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case RequisicionActionTypes.SAVE_REQUISICION_SUCCESS:
    case RequisicionActionTypes.UPDATE_REQUISICION_SUCCESS: {
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

export const getRequisicionLoaded = (state: RequisicionState) => state.loaded;
export const getRequisicionLoading = (state: RequisicionState) => state.loading;
export const getRequisicionEntities = (state: RequisicionState) =>
  state.entities;
