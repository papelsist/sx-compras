import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromDevoluciones from './devolucion.reducer';

export interface State {
  devoluciones: fromDevoluciones.State;
}

export const reducers: ActionReducerMap<State> = {
  devoluciones: fromDevoluciones.reducer
};

export const getState = createFeatureSelector<State>('credito');
