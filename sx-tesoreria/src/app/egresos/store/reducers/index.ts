import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromGastos from './gastos.reducer';
import * as fromCompras from './compras.reducer';
import * as fromCheques from './cheques.reducer';
import * as fromRembolsos from './rembolso.reducers';
import * as fromCompraMoneda from './compra-moneda.reducer';
import * as fromPagoDeNomina from './pago-nomina.reducer';
import * as fromPagosMorralla from './pago-morralla.reducer';

export interface State {
  gastos: fromGastos.State;
  compras: fromCompras.State;
  cheques: fromCheques.State;
  rembolsos: fromRembolsos.State;
  compraMonedas: fromCompraMoneda.State;
  pagoNominas: fromPagoDeNomina.State;
  morrallas: fromPagosMorralla.State;
}

export const reducers: ActionReducerMap<State> = {
  gastos: fromGastos.reducer,
  compras: fromCompras.reducer,
  cheques: fromCheques.reducer,
  rembolsos: fromRembolsos.reducer,
  compraMonedas: fromCompraMoneda.reducer,
  pagoNominas: fromPagoDeNomina.reducer,
  morrallas: fromPagosMorralla.reducer
};

export const getState = createFeatureSelector<State>('egresos');
