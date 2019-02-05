import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCfdis from './cfdis.reducer';
import * as fromCancelados from './cfdis-cancelados.reducer';
import * as fromPorCancelar from './por-cancelar.reducer';

export interface State {
  cfdis: fromCfdis.State;
  cancelados: fromCancelados.State;
  porCanelar: fromPorCancelar.State;
}

export const reducers: ActionReducerMap<State> = {
  cfdis: fromCfdis.reducer,
  cancelados: fromCancelados.reducer,
  porCanelar: fromPorCancelar.reducer
};

export const getState = createFeatureSelector<State>('cfdis');
