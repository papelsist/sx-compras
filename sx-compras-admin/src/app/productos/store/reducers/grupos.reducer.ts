import * as fromGrupos from '../actions/grupos.actions';

import { GrupoDeProducto } from '../../models/grupo';

import * as _ from 'lodash';

export interface GrupoState {
  entities: { [id: string]: GrupoDeProducto };
  loaded: boolean;
  loading: boolean;
}

export const initialState: GrupoState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromGrupos.GrupoActions
): GrupoState {
  switch (action.type) {
    case fromGrupos.LOAD_GRUPOS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromGrupos.LOAD_GRUPOS_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }

    case fromGrupos.LOAD_GRUPOS_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case fromGrupos.CREATE_GRUPO_SUCCESS:
    case fromGrupos.UPDATE_GRUPO_SUCCESS: {
      const linea = action.payload;
      const entities = { ...state.entities, [linea.id]: linea };

      return {
        ...state,
        entities
      };
    }

    case fromGrupos.REMOVE_GRUPO_SUCCESS: {
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

export const getGruposEntities = (state: GrupoState) => state.entities;
export const getGruposLoaded = (state: GrupoState) => state.loaded;
export const getGruposLoading = (state: GrupoState) => state.loading;
