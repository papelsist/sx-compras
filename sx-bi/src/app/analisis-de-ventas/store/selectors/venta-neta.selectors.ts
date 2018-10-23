import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromVentaNeta from '../reducers/venta-neta.reducers';

export const getVentaNetaState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.ventaNeta
);

export const getVentaNetaEntities = createSelector(
  getVentaNetaState,
  fromVentaNeta.selectAll
);

export const getAllVentaNeta = createSelector(
  getVentaNetaState,
  fromVentaNeta.selectAll
);

export const getVentaNetaLoaded = createSelector(
  getVentaNetaState,
  fromVentaNeta.getVentasNetasLoaded
);

export const getVentaNetaLoading = createSelector(
  getVentaNetaState,
  fromVentaNeta.getVentasNetasLoading
);

export const getSelectedVentaNeta = createSelector(
  getVentaNetaEntities,
  fromRoot.getRouterState,
  (entities, router): Object => {
    return router.state && entities[router.state.params.id];
  }
);

export const getVentaNetaFilter = createSelector(
  getVentaNetaState,
  fromVentaNeta.getVentaNetaFilter
);
