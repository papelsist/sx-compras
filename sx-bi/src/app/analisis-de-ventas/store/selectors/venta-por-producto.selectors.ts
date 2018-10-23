import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromVentaPorProducto from '../reducers/venta-por-producto.reducer';

export const getVentaPorProductoState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.ventaPorProducto
);

export const getVentaPorProductoEntities = createSelector(
  getVentaPorProductoState,
  fromVentaPorProducto.selectAll
);

export const getAllVentaPorProducto = createSelector(
  getVentaPorProductoState,
  fromVentaPorProducto.selectAll
);

export const getVentaPorProductoLoading = createSelector(
  getVentaPorProductoState,
  fromVentaPorProducto.getVentasNetasLoading
);

export const getSelectedProducto = createSelector(
  getVentaPorProductoEntities,
  fromRoot.getRouterState,
  (entities, router): Object => {
    return router.state && entities[router.state.params.id];
  }
);
