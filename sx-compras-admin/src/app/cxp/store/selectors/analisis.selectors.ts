import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnalisis from '../reducers/analisis.reducer';

import * as _ from 'lodash';

export const getAnalisisState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.analisis
);

export const getAnalisisEntities = createSelector(
  getAnalisisState,
  fromAnalisis.getAnalisisEntities
);

export const getAllAnalisis = createSelector(getAnalisisEntities, entities =>
  _.sortBy(Object.keys(entities).map(id => entities[id]), 'id')
);

export const getLoading = createSelector(
  getAnalisisState,
  fromAnalisis.getAnalisisLoading
);

export const getAnalisisLoaded = createSelector(
  getAnalisisState,
  fromAnalisis.getAnalisisLoaded
);

// Analisis form selectors
export const getFacturasPendientesEntities = createSelector(
  getAnalisisState,
  fromAnalisis.getFacturasPendientes
);

export const getAllFacturasPendientes = createSelector(
  getFacturasPendientesEntities,
  entities => _.sortBy(Object.keys(entities).map(id => entities[id]), 'folio')
);
