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

export const getSelectedVenta = createSelector(
  getVentaNetaState,
  fromVentaNeta.getSelected
);

/*
export const getSelectedVentaNeta = createSelector(
  getVentaNetaEntities,
  fromRoot.getRouterState,
  (entities, router) => {
    const id = router.state.params.id;
    console.log('Analizando Row: ', id);
    return router.state && entities[router.state.params.id];
  }
);
*/

export const getVentaFilter = createSelector(
  getVentaNetaState,
  fromVentaNeta.getVentaFilter
);

export const getSegmento = createSelector(
  getVentaFilter,
  filter => filter.clasificacion
);
