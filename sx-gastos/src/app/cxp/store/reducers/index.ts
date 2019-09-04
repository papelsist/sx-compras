import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCfdis from './cfdi.reducer';
import * as fromRequisicion from './requisicion.reducer';
import * as fromRequisicionForm from './requisicion-form.reducer';
import * as fromNotas from './notas.reducers';
import * as fromFacturas from './facturas.reducer';
import * as fromPagos from './pagos.reducer';
import * as fromCheques from './cheques.reducer';
import * as fromRembolsos from './rembolso.reducers';
import * as fromGastos from './gasto.reducer';

export interface State {
  cfdis: fromCfdis.State;
  requisiciones: fromRequisicion.State;
  requisicionForm: fromRequisicionForm.FormState;
  notas: fromNotas.State;
  facturas: fromFacturas.State;
  pagos: fromPagos.State;
  cheques: fromCheques.State;
  rembolsos: fromRembolsos.State;
  gastos: fromGastos.State;
}

export const reducers: ActionReducerMap<State> = {
  cfdis: fromCfdis.reducer,
  requisiciones: fromRequisicion.reducer,
  requisicionForm: fromRequisicionForm.reducer,
  notas: fromNotas.reducer,
  facturas: fromFacturas.reducer,
  pagos: fromPagos.reducer,
  cheques: fromCheques.reducer,
  rembolsos: fromRembolsos.reducer,
  gastos: fromGastos.reducer
};

export const getState = createFeatureSelector<State>('cxp');
