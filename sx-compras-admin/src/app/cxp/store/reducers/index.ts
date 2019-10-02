import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCfdis from './cfdi.reducer';
import * as formAnalisis from './analisis.reducer';
import * as fromRequisicion from './requisicion.reducer';
import * as fromRequisicionForm from './requisicion-form.reducer';
import * as fromNotas from './notas.reducers';
import * as fromFacturas from './facturas.reducer';
import * as fromContrarecibos from './contrarecibos.reducer';
import * as fromPagos from './pagos.reducer';
import * as fromAnalisisDeNota from './analisis-de-nota.reducer';
import * as fromAnalisisDeTransformacion from './analisis-de-transformacion.reducer';
import * as fromAnalisisTrsDet from './analisis-de-transformacion-det.reducer';

export interface CxpState {
  cfdis: fromCfdis.State;
  analisis: formAnalisis.AnalisisDeFacturaState;
  requisiciones: fromRequisicion.RequisicionState;
  requisicionForm: fromRequisicionForm.FormState;
  notas: fromNotas.State;
  facturas: fromFacturas.State;
  contrarecibos: fromContrarecibos.State;
  pagos: fromPagos.State;
  analisisDeNota: fromAnalisisDeNota.State;
  analisisDeTransformacion: fromAnalisisDeTransformacion.State;
  analisisDeTrsDet: fromAnalisisTrsDet.State;
}

export const reducers: ActionReducerMap<CxpState> = {
  cfdis: fromCfdis.reducer,
  analisis: formAnalisis.reducer,
  requisiciones: fromRequisicion.reducer,
  requisicionForm: fromRequisicionForm.reducer,
  notas: fromNotas.reducer,
  facturas: fromFacturas.reducer,
  contrarecibos: fromContrarecibos.reducer,
  pagos: fromPagos.reducer,
  analisisDeNota: fromAnalisisDeNota.reducer,
  analisisDeTransformacion: fromAnalisisDeTransformacion.reducer,
  analisisDeTrsDet: fromAnalisisTrsDet.reducer
};

export const getCxpState = createFeatureSelector<CxpState>('cxp');
