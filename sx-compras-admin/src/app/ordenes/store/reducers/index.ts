import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAlcance from './alcance.reducer';
import * as fromCompras from './compra.reducer';

export interface State {
  compras: fromCompras.State;
  alcance: fromAlcance.State;
}

export const reducers: ActionReducerMap<State> = {
  compras: fromCompras.reducer,
  alcance: fromAlcance.reducer
};

export const getOrdenesState = createFeatureSelector<State>('ordenes');
