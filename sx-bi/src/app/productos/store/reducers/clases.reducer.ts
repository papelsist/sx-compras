import * as fromClases from '../actions/clases.actions';

import * as _ from 'lodash';

import { Clase } from '../../models/clase';

export interface ClaseState {
  entities: { [id: string]: Clase };
  loading: boolean;
  loaded: boolean;
}

export const initialState: ClaseState = {
  entities: {},
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: fromClases.ClasesActions
): ClaseState {
  switch (action.type) {
    case fromClases.LOAD_CLASES: {
      return {
        ...state,
        loading: true
      };
    }
    case fromClases.LOAD_CLASES_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        entities: _.keyBy(action.payload, 'id')
      };
    }
    case fromClases.LOAD_CLASES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromClases.UPDATE_CLASE_SUCCESS:
    case fromClases.CREATE_CLASE_SUCCESS: {
      const clase = action.payload;
      const entities = { ...state.entities, [clase.id]: clase };
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getClasesEntities = (state: ClaseState) => state.entities;
export const getClasesLoading = (state: ClaseState) => state.loading;
export const getClasesLoaded = (state: ClaseState) => state.loaded;
