import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromLineas from '../reducers/lineas.reducer';

export const getLineasState = createSelector(
  fromFeature.getCatalogosState,
  (state: fromFeature.CatalogosState) => state.lineas
);

export const getLineasEntities = createSelector(
  getLineasState,
  fromLineas.getLineasEntities
);

export const getAllLineas = createSelector(getLineasEntities, entities => {
  return Object.keys(entities).map(id => entities[id]);
});

export const getLineasLoaded = createSelector(
  getLineasState,
  fromLineas.getLineasLoaded
);

export const getLineaLoading = createSelector(
  getLineasState,
  fromLineas.getLineasLoading
);
