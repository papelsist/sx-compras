import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as formAnalisis from './analisis.reducer';

export interface CxpState {
  analisis: formAnalisis.AnalisisDeFacturaState;
}

export const reducers: ActionReducerMap<CxpState> = {
  analisis: formAnalisis.reducer
};

export const getCatalogosState = createFeatureSelector<CxpState>('cxp');
