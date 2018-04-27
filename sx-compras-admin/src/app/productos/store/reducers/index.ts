import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector
} from '@ngrx/store';

import * as fromProductos from './productos.reducers';

export interface CatalogosState {
  productos: fromProductos.ProductoState;
}

export const reducers: ActionReducerMap<CatalogosState> = {
  productos: fromProductos.reducer
};

export const getCatalogosState = createFeatureSelector<CatalogosState>(
  'catalogos'
);

/* The feature module state Tree
const stateTree = {
  catalogo: {
    producto: {
      data: [],
      loaded: false,
      loading: false
    }
  }
};
*/

// producto state
export const getProductoState = createSelector(
  getCatalogosState,
  (state: CatalogosState) => state.productos
);

export const getProductosEntities = createSelector(
  getProductoState,
  fromProductos.getProductosEntities
);

export const getAllProductos = createSelector(
  getProductosEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);

export const getProductosLoaded = createSelector(
  getProductoState,
  fromProductos.getProductosLoaded
);

export const getProductosLoading = createSelector(
  getProductoState,
  fromProductos.getProductosLoading
);
