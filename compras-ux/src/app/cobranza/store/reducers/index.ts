import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromCartera from './cartera.reducer';
import * as fromCobros from './cobro.reducer';
import * as fromNotas from './nota-de-credito.reducer';
import * as fromSolicitudes from './solicitud.reducer';
import * as fromNotasDeCargo from './nota-de-cargo.reducer';

export interface State {
  cartera: fromCartera.State;
  cobros: fromCobros.State;
  notas: fromNotas.State;
  solicitudes: fromSolicitudes.State;
  notasDeCargo: fromNotasDeCargo.State;
}

export const reducers: ActionReducerMap<State> = {
  cartera: fromCartera.reducer,
  cobros: fromCobros.reducer,
  notas: fromNotas.reducer,
  solicitudes: fromSolicitudes.reducer,
  notasDeCargo: fromNotasDeCargo.reducer
};

export const getState = createFeatureSelector<State>('cobranza');

export const getCarteraState = createSelector(
  getState,
  state => state.cartera
);

export const getCartera = createSelector(
  getCarteraState,
  state => state.cartera
);
