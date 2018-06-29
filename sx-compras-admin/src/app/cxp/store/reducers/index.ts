import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as formAnalisis from './analisis.reducer';
import * as fromRequisicion from './requisicion.reducer';
import * as fromRequisicionForm from './requisicion-form.reducer';

export interface CxpState {
  analisis: formAnalisis.AnalisisDeFacturaState;
  requisiciones: fromRequisicion.RequisicionState;
  requisicionForm: fromRequisicionForm.FormState;
}

export const reducers: ActionReducerMap<CxpState> = {
  analisis: formAnalisis.reducer,
  requisiciones: fromRequisicion.reducer,
  requisicionForm: fromRequisicionForm.reducer
};

export const getCxpState = createFeatureSelector<CxpState>('cxp');
