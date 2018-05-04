import * as fromLineas from '../actions/lineas.actions';

import { Linea } from '../../models/linea';

import * as _ from 'lodash';

export interface LineaState {
  entities: { [id: string]: Linea };
  loaded: boolean;
  loading: boolean;
}

export const initialState: LineaState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromLineas.LineasActions
): LineaState {
  switch (action.type) {
    case fromLineas.LOAD_LINEAS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromLineas.LOAD_LINEAS_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromLineas.LOAD_LINEAS_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
  }
  return state;
}

export const getLineasEntities = (state: LineaState) => state.entities;
export const getLineasLoaded = (state: LineaState) => state.loaded;
export const getLineasLoading = (state: LineaState) => state.loading;
