import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromMovimientos from '../reducers/movimientos.reducre';

import { Movimiento } from '../../models/movimiento';

import * as _ from 'lodash';

export const getMovimientosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.movimientos
);

export const getMovimientosEntities = createSelector(
  getMovimientosState,
  fromMovimientos.selectEntities
);

export const getAllMovimientos = createSelector(
  getMovimientosState,
  fromMovimientos.selectAll
);

export const getMovimientosLoaded = createSelector(
  getMovimientosState,
  fromMovimientos.getMovimientosLoaded
);

export const getMovimientosLoading = createSelector(
  getMovimientosState,
  fromMovimientos.getMovimientosLoading
);

export const getEgresos = createSelector(getAllMovimientos, movimientos =>
  movimientos.filter(item => item.importe < 0)
);

export const getIngresos = createSelector(getAllMovimientos, movimientos =>
  movimientos.filter(item => item.importe > 0)
);

export const getSelectedMovimiento = createSelector(
  getMovimientosEntities,
  fromRoot.getRouterState,
  (entities, router): Movimiento => {
    return router.state && entities[router.state.params.movimientoId];
  }
);
