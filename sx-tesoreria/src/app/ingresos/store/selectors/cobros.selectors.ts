import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromCobros from '../reducers/cobros.reducer';
import { Cobro } from '../../models/cobro';

export const getCobrosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cobros
);

export const getCobrosEntities = createSelector(
  getCobrosState,
  fromCobros.selectEntities
);

export const getAllCobros = createSelector(
  getCobrosState,
  fromCobros.selectAll
);

export const getCobrosLoaded = createSelector(
  getCobrosState,
  fromCobros.getCobrosLoaded
);

export const getCobrosLoading = createSelector(
  getCobrosState,
  fromCobros.getCobrosLoading
);

export const getSelectedCobro = createSelector(
  getCobrosEntities,
  fromRoot.getRouterState,
  (entities, router): Cobro => {
    return router.state && entities[router.state.params.cobroId];
  }
);

export const getCobrosFilter = createSelector(
  getCobrosState,
  fromCobros.getCobrosFilter
);

export const getCobrosSearchTerm = createSelector(
  getCobrosState,
  fromCobros.getCobrosSearchTerm
);
