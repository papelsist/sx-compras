import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCobradores from './cobrador.reducer';

export interface State {
  cobradores: fromCobradores.State;
}

export const reducers: ActionReducerMap<State> = {
  cobradores: fromCobradores.reducer
};

export const getState = createFeatureSelector<State>('clientes');
