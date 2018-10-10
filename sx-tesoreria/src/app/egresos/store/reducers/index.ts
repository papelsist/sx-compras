import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromGastos from './gastos.reducer';
import * as fromCompras from './compras.reducer';
import * as fromCheques from './cheques.reducer';

export interface State {
  gastos: fromGastos.State;
  compras: fromCompras.State;
  cheques: fromCheques.State;
}

export const reducers: ActionReducerMap<State> = {
  gastos: fromGastos.reducer,
  compras: fromCompras.reducer,
  cheques: fromCheques.reducer
};

export const getState = createFeatureSelector<State>('egresos');
