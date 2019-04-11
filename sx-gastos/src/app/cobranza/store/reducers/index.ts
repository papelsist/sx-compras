import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobros from './cobro.reducer';
import * as fromSolicitudes from './solicitud.reducer';
import { Cartera } from 'app/cobranza/models';

export interface State {
  cobros: fromCobros.State;
  solicitudes: fromSolicitudes.State;
}

export const reducers: ActionReducerMap<State> = {
  cobros: fromCobros.reducer,
  solicitudes: fromSolicitudes.reducer
};

export const getState = createFeatureSelector<State>('cobranza');
