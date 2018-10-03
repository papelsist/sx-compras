import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromGastos from './gastos.reducer';

export interface State {
  gastos: fromGastos.State;
}

export const reducers: ActionReducerMap<State> = {
  gastos: fromGastos.reducer
};

export const getState = createFeatureSelector<State>('egresos');
