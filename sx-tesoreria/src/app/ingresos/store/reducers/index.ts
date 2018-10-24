import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobros from './cobros.reducer';

export interface State {
  cobros: fromCobros.State;
}

export const reducers: ActionReducerMap<State> = {
  cobros: fromCobros.reducer
};

export const getState = createFeatureSelector<State>('ingresos');
