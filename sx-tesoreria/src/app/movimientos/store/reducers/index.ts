import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRembolsos from './traspaso.reducers';

export interface State {
  traspasos: fromRembolsos.State;
}

export const reducers: ActionReducerMap<State> = {
  traspasos: fromRembolsos.reducer
};

export const getState = createFeatureSelector<State>('movimientos');
