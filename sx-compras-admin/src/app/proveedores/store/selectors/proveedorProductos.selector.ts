import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromProductos from '../reducers/proveedorProductos.reducer';
import { ProveedorProducto } from '../../models/proveedorProducto';

import * as _ from 'lodash';

export const getProveedorProductosState = createSelector(
  fromFeature.getProveedoresState,
  (state: fromFeature.ProveedoresState) => state.productos
);

export const getProveedorProductosEntities = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosEntites
);

export const getAllProveedorProductos = createSelector(
  getProveedorProductosEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);

export const getProveedorProductosLoaded = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosLoaded
);

export const getProveedorProductosLoading = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosLoading
);

export const getSelectedProveedorProductos = createSelector(
  getProveedorProductosState,
  fromRoot.getRouterState,
  (entities, router): ProveedorProducto => {
    return router.state && entities[router.state.params.proveedorId];
  }
);

export const getProveedorProductosFilter = createSelector(
  getProveedorProductosState,
  fromProductos.getProveedorProductosSearchFilter
);
