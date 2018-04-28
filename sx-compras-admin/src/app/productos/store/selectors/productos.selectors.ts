
import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromProductos from '../reducers/productos.reducers';

export const getProductoState = createSelector(
  fromFeature.getCatalogosState,
  (state: fromFeature.CatalogosState) => state.productos,
);

export const getProductosEntities = createSelector(
  getProductoState,
  fromProductos.getProductosEntities,
);

export const getAllProductos = createSelector(
  getProductosEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  },
);

export const getProductosLoaded = createSelector(
  getProductoState,
  fromProductos.getProductosLoaded,
);

export const getProductosLoading = createSelector(
  getProductoState,
  fromProductos.getProductosLoading,
);
