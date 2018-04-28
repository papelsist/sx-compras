import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProductos from './productos.reducers';

export interface CatalogosState {
  productos: fromProductos.ProductoState;
}

export const reducers: ActionReducerMap<CatalogosState> = {
  productos: fromProductos.reducer,
};

export const getCatalogosState = createFeatureSelector<CatalogosState>(
  'catalogos',
);
