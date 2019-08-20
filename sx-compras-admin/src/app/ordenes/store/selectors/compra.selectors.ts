import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromCompras from '../reducers/compra.reducer';
import { Compra } from '../../models/compra';

import * as _ from 'lodash';

export const getComprasState = createSelector(
  fromFeature.getOrdenesState,
  (state: fromFeature.State) => state.compras
);

export const getComprasEntities = createSelector(
  getComprasState,
  fromCompras.selectEntities
);

export const getAllCompras = createSelector(
  getComprasState,
  fromCompras.selectAll
);

export const getAllComprasPendientes = createSelector(
  getAllCompras,
  compras => compras.filter(item => item.status !== 'A')
);

export const getComprasPeriodo = createSelector(
  getComprasState,
  fromCompras.getPeriodo
);

export const getComprasLoaded = createSelector(
  getComprasState,
  fromCompras.getComprasLoaded
);

export const getComprasLoading = createSelector(
  getComprasState,
  fromCompras.getComprasLoading
);

export const getSelectedCompra = createSelector(
  getComprasEntities,
  fromRoot.getRouterState,
  (entities, router): Compra => {
    return router.state && entities[router.state.params.compraId];
  }
);

export const getComprasPorSucursal = createSelector(
  getAllCompras,
  compras => _.groupBy(compras, 'sucursalNombre')
);

export const getComprasPorSucursalPendientes = createSelector(
  getAllComprasPendientes,
  compras => _.groupBy(compras, 'sucursalNombre')
);
