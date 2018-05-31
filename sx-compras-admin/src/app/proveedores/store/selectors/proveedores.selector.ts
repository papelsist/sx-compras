import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromProveedores from '../reducers/proveedores.reducer';
import { Proveedor } from '../../models/proveedor';

export const getProveedorState = createSelector(
  fromFeature.getProveedoresState,
  (state: fromFeature.ProveedoresState) => state.proveedores
);

export const getProveedoresEntities = createSelector(
  getProveedorState,
  fromProveedores.getProveedorEntites
);

export const getAllProveedores = createSelector(
  getProveedoresEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);

export const getProveedoresLoaded = createSelector(
  getProveedorState,
  fromProveedores.getProveedoresLoaded
);

export const getProveedoresLoading = createSelector(
  getProveedorState,
  fromProveedores.getProveedoresLoading
);

export const getSelectedProveedor = createSelector(
  getProveedoresEntities,
  fromRoot.getRouterState,
  (entities, router): Proveedor => {
    return router.state && entities[router.state.params.proveedorId];
  }
);
