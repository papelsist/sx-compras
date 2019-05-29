import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromBonificaciones from './bonificacion.reducer';
import * as fromDevolucion from './devolucion.reducer';

export interface State {
  bonificacion: fromBonificaciones.State;
  devolucion: fromDevolucion.State;
}

export const reducers: ActionReducerMap<State> = {
  bonificacion: fromBonificaciones.reducer,
  devolucion: fromDevolucion.reducer
};

export const getState = createFeatureSelector<State>('notas');
