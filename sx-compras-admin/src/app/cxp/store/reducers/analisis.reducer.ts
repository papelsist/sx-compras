import { Analisis } from '../../model/analisis';

import * as fromAnalisis from '../actions/analisis.actions';

import * as _ from 'lodash';

export interface AnalisisDeFacturaState {
  entities: { [id: string]: Analisis };
  loaded: boolean;
  loading: boolean;
}

export const initialState: AnalisisDeFacturaState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromAnalisis.AnalisisActions
): AnalisisDeFacturaState {
  switch (action.type) {
    case fromAnalisis.AnalisisActionTypes.LOAD: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
    case fromAnalisis.AnalisisActionTypes.LOAD_SUCCESS: {
      const entities = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loaded: true,
        loading: false,
        entities
      };
    }
  }
  return state;
}

export const getAnalisisLoaded = (state: AnalisisDeFacturaState) =>
  state.loaded;
export const getAnalisisLoading = (state: AnalisisDeFacturaState) =>
  state.loading;
export const getAnalisisEntities = (state: AnalisisDeFacturaState) =>
  state.entities;
