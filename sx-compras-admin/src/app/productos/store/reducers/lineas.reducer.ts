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

    case fromLineas.CREATE_LINEA_SUCCESS:
    case fromLineas.UPDATE_LINEA_SUCCESS: {
      const linea = action.payload;
      const entities = { ...state.entities, [linea.id]: linea };

      return {
        ...state,
        entities
      };
    }

    case fromLineas.REMOVE_LINEA_SUCCESS: {
      const linea = action.payload;
      const { [linea.id]: result, ...entities } = state.entities;
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getLineasEntities = (state: LineaState) => state.entities;
export const getLineasLoaded = (state: LineaState) => state.loaded;
export const getLineasLoading = (state: LineaState) => state.loading;
