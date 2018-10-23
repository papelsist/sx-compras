import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromVentaNeta from './venta-neta.reducers';
import * as fromVentaPorProducto from './venta-por-producto.reducer';

export interface State {
  ventaNeta: fromVentaNeta.State;
  ventaPorProducto: fromVentaPorProducto.State;
}

export const reducers: ActionReducerMap<State> = {
  ventaNeta: fromVentaNeta.reducer,
  ventaPorProducto: fromVentaPorProducto.reducer
};

export const getState = createFeatureSelector<State>('analisis-de-venta');
