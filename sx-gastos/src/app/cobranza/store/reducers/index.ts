import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobros from './cobro.reducer';
import * as fromSolicitudes from './solicitud.reducer';
import * as fromNotasDeCargo from './nota-de-cargo.reducer';

export interface State {
  cobros: fromCobros.State;
  solicitudes: fromSolicitudes.State;
  notasDeCargo: fromNotasDeCargo.State;
}

export const reducers: ActionReducerMap<State> = {
  cobros: fromCobros.reducer,
  solicitudes: fromSolicitudes.reducer,
  notasDeCargo: fromNotasDeCargo.reducer
};

export const getState = createFeatureSelector<State>('cobranza');
