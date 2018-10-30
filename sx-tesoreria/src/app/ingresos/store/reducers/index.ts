import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobros from './cobros.reducer';
import * as fromChequeDevuelto from './cheque-devuelto.reducer';

export interface State {
  cobros: fromCobros.State;
  chequesdevueltos: fromChequeDevuelto.State;
}

export const reducers: ActionReducerMap<State> = {
  cobros: fromCobros.reducer,
  chequesdevueltos: fromChequeDevuelto.reducer
};

export const getState = createFeatureSelector<State>('ingresos');
