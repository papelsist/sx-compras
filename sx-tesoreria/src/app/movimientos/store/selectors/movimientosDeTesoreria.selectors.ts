import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromMovimientos from '../reducers/movimientoDeTesoreria.reducers';
import { MovimientoDeTesoreria } from '../../models';

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

export const getSelectedMovimiento = createSelector(
  getMovimientosEntities,
  fromRoot.getRouterState,
  (entities, router): MovimientoDeTesoreria => {
    return router.state && entities[router.state.params.movimientoId];
  }
);

export const getMovimientosFilter = createSelector(
  getMovimientosState,
  fromMovimientos.getMovimientosFilter
);

export const getMovimientosSearchTerm = createSelector(
  getMovimientosState,
  fromMovimientos.getMovimientosSearchTerm
);
