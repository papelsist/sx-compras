import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as formAnalisis from './analisis.reducer';
import * as fromRequisicion from './requisicion.reducer';
import * as fromRequisicionForm from './requisicion-form.reducer';
import * as fromNotas from './notas.reducers';
import * as fromFacturas from './facturas.reducer';

export interface CxpState {
  analisis: formAnalisis.AnalisisDeFacturaState;
  requisiciones: fromRequisicion.RequisicionState;
  requisicionForm: fromRequisicionForm.FormState;
  notas: fromNotas.State;
  facturas: fromFacturas.State;
}

export const reducers: ActionReducerMap<CxpState> = {
  analisis: formAnalisis.reducer,
  requisiciones: fromRequisicion.reducer,
  requisicionForm: fromRequisicionForm.reducer,
  notas: fromNotas.reducer,
  facturas: fromFacturas.reducer
};

export const getCxpState = createFeatureSelector<CxpState>('cxp');
