import { createSelector } from '@ngrx/store';
import * as fromListas from '../reducers/listasDePrecios.reducer';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';

export const getListasState = createSelector(
  fromFeature.getProveedoresState,
  (state: fromFeature.ProveedoresState) => state.listas
);

export const getListasEntities = createSelector(
  getListasState,
  fromListas.selectEntities
);

// export const getListasEntities = fromListas.selectEntities;

export const getAllListas = createSelector(
  getListasState,
  fromListas.selectAll
);

export const getListasLoaded = createSelector(
  getListasState,
  fromListas.getListasProveedorLoaded
);

export const getListasLoading = createSelector(
  getListasState,
  fromListas.getListasProveedorLoading
);

export const getSelectedLista = createSelector(
  getListasEntities,
  fromRoot.getRouterState,
  (entities, router): ListaDePreciosProveedor => {
    return router.state && entities[router.state.params.id];
  }
);

/*
export const getSelectedProveedorProductos = createSelector(
  getProveedorProductosState,
  fromRoot.getRouterState,
  (entities, router): ProveedorProducto => {
    return router.state && entities[router.state.params.proveedorId];
  }
);
*/
