import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromGastos from './gastos.reducer';
import * as fromCompras from './compras.reducer';

export interface State {
  gastos: fromGastos.State;
  compras: fromCompras.State;
}

export const reducers: ActionReducerMap<State> = {
  gastos: fromGastos.reducer,
  compras: fromCompras.reducer
};

export const getState = createFeatureSelector<State>('egresos');
