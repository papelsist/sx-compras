import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';
import { Recibo } from '../models';

export const selectPeriodo = createSelector(
  fromFeature.getRecibosState,
  fromFeature.getPeriodo
);

export const getRecibosEntities = createSelector(
  fromFeature.getRecibosState,
  fromFeature.selectEntities
);

export const getAllRecibos = createSelector(
  fromFeature.getRecibosState,
  fromFeature.selectAll
);

export const selectRecibosLoaded = createSelector(
  fromFeature.getRecibosState,
  fromFeature.getLoaded
);

export const selectRecibosLoading = createSelector(
  fromFeature.getRecibosState,
  fromFeature.getLoading
);

export const getCurrentRecibo = createSelector(
  getRecibosEntities,
  fromRoot.getRouterState,
  (entities, router): Recibo => {
    return router.state && entities[router.state.params.reciboId];
  }
);
