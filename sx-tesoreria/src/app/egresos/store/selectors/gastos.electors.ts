import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromGastos from '../reducers/gastos.reducer';
import { Requisicion } from '../../models';

import * as _ from 'lodash';

export const getGastosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.gastos
);

export const getGastosEntities = createSelector(
  getGastosState,
  fromGastos.selectEntities
);

export const getGastos = createSelector(getGastosState, fromGastos.selectAll);

export const getGastosLoading = createSelector(
  getGastosState,
  fromGastos.getGastosLoading
);

export const getSelectedGasto = createSelector(
  getGastosEntities,
  fromRoot.getRouterState,
  (entities, router): Requisicion => {
    return router.state && entities[router.state.params.requisicionId];
  }
);

export const getGastosLoaded = createSelector(
  getGastosState,
  fromGastos.getGastosLoaded
);

export const getGastosFilter = createSelector(
  getGastosState,
  fromGastos.getGastosFilter
);
