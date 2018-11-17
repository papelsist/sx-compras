import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobros from './cobros.reducer';
import * as fromChequeDevuelto from './cheque-devuelto.reducer';
import * as fromFichas from './ficha.reducer';

export interface State {
  cobros: fromCobros.State;
  chequesdevueltos: fromChequeDevuelto.State;
  fichas: fromFichas.State;
}

export const reducers: ActionReducerMap<State> = {
  cobros: fromCobros.reducer,
  chequesdevueltos: fromChequeDevuelto.reducer,
  fichas: fromFichas.reducer
};

export const getState = createFeatureSelector<State>('ingresos');
