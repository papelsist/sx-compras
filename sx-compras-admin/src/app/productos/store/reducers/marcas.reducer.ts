import * as fromMarcas from '../actions/marcas.actions';

import * as _ from 'lodash';

import { Marca } from '../../models/marca';

export interface MarcaState {
  entities: { [id: string]: Marca };
  loading: boolean;
  loaded: boolean;
}

export const initialState: MarcaState = {
  entities: {},
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: fromMarcas.MarcasActions
): MarcaState {
  switch (action.type) {
    case fromMarcas.LOAD_MARCAS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromMarcas.LOAD_MARCAS_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromMarcas.LOAD_MARCAS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromMarcas.UPDATE_MARCA_SUCCESS:
    case fromMarcas.CREATE_MARCA_SUCCESS: {
      const marca = action.payload;
      const entities = { ...state.entities, [marca.id]: marca };
      return {
        ...state,
        entities
      };
    }

    case fromMarcas.REMOVE_MARCA_SUCCESS: {
      const marca = action.payload;
      const { [marca.id]: result, ...entities } = state.entities;
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getMarcasEntities = (state: MarcaState) => state.entities;
export const getMarcasLoading = (state: MarcaState) => state.loading;
export const getMarcasLoaded = (state: MarcaState) => state.loaded;
