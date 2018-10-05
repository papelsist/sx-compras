import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromRecepciones from './recepciones.reducer';

export const FEATURE_NAME = 'recepciones';
const STORE_KEYS_TO_PERSIST = ['timezone', 'notifications'];

export interface State {
  recepciones: fromRecepciones.State;
}

export const reducers: ActionReducerMap<State> = {
  recepciones: fromRecepciones.reducer
};

export const getRecepcionesState = createFeatureSelector<State>(FEATURE_NAME);
