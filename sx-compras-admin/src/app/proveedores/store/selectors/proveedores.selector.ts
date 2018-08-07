import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromProveedores from '../reducers/proveedores.reducer';
import { Proveedor } from '../../models/proveedor';

import * as _ from 'lodash';

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

export const getCurrentProveedor = createSelector(
  getProveedorState,
  getProveedoresEntities,
  (state, entities) => {
    return state.current && entities[state.current];
  }
);

export const getSelectedProveedor = createSelector(
  getProveedoresEntities,
  fromRoot.getRouterState,
  (entities, router): Proveedor => {
    return (
      router.state &&
      router.state.parentParams &&
      entities[router.state.parentParams.proveedorId]
    );
  }
);

export const getProveedoresFilter = createSelector(
  getProveedorState,
  fromProveedores.getProveedoresSearchFilter
);

export const getFilteredProveedores = createSelector(
  getAllProveedores,
  getProveedoresFilter,
  (proveedores, filter) => {
    let filtered = [...proveedores];
    if (filter.term) {
      filtered = _.filter(
        proveedores,
        item =>
          item.nombre.toLowerCase().indexOf(filter.term.toLowerCase()) !== -1 ||
          item.clave.toLowerCase().indexOf(filter.term.toLowerCase()) !== -1
      );
    }
    if (filter.activos) {
      filtered = _.filter(filtered, item => item.activo === filter.activos);
    }

    if (filter.suspendidos) {
      filtered = _.filter(
        filtered,
        item => item.activo === !filter.suspendidos
      );
    }

    return filtered;
  }
);
