import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromComs from './recepcion.reducer';

export interface State {
  coms: fromComs.State;
}

export const reducers: ActionReducerMap<State> = {
  coms: fromComs.reducer
};

export const getRecepcionesState = createFeatureSelector<State>('recepciones');
