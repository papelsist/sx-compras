import * as _ from 'lodash';

import * as fromLineas from '../actions/lineas.actions';

import { Linea } from '../../models/linea';


export interface LineaState {
  entities: { [id: string]: Linea };
  loaded: boolean;
  loading: boolean;
}

export const initialState: LineaState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromLineas.LineasActions,
): LineaState {
  switch (action.type) {
    case fromLineas.LOAD_LINEAS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromLineas.LOAD_LINEAS_SUCCESS: {
      const lineas = action.payload;

      return {
        ...state,
        loaded: true,
        loading: false
      }
    }
  }
  return state;
}
