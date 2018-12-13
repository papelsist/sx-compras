import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCuentas from './cuentas.reducer';
import * as fromEstado from './estado-de-cuenta.reducer';
import * as fromMovimientos from './movimientos.reducer';
import * as fromSaldos from './saldos.reducre';

export interface State {
  cuentas: fromCuentas.State;
  estadoDeCuenta: fromEstado.State;
  movimientos: fromMovimientos.State;
  saldos: fromSaldos.State;
}

export const reducers: ActionReducerMap<State> = {
  cuentas: fromCuentas.reducer,
  estadoDeCuenta: fromEstado.reducer,
  movimientos: fromMovimientos.reducer,
  saldos: fromSaldos.reducer
};

export const getState = createFeatureSelector<State>('cuentas');
