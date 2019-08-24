import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromGastos from '../reducers/gasto.reducer';
import { GastoDet } from '../../model';

export const getGastosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.gastos
);

export const getGastosEntities = createSelector(
  getGastosState,
  fromGastos.selectEntities
);

export const getAllGastos = createSelector(
  getGastosState,
  fromGastos.selectAll
);

export const getGastosLoaded = createSelector(
  getGastosState,
  fromGastos.getGastosLoaded
);

export const getGastosLoading = createSelector(
  getGastosState,
  fromGastos.getGastosLoading
);

export const getSelectedGasto = createSelector(
  getGastosEntities,
  fromRoot.getRouterState,
  (entities, router): GastoDet => {
    return router.state && entities[router.state.params.gastoId];
  }
);
