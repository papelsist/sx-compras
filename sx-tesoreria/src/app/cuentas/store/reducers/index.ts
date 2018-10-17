import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCuentas from './cuentas.reducer';
import * as fromMovimientos from './movimientos.reducre';
import * as fromSaldos from './saldos.reducre';

export interface State {
  cuentas: fromCuentas.State;
  movimientos: fromMovimientos.State;
  saldos: fromSaldos.State;
}

export const reducers: ActionReducerMap<State> = {
  cuentas: fromCuentas.reducer,
  movimientos: fromMovimientos.reducer,
  saldos: fromSaldos.reducer
};

export const getState = createFeatureSelector<State>('cuentas');
