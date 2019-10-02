import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnalisis from '../reducers/analisis-de-transformacion-det.reducer';

import * as _ from 'lodash';

export const getAnalisisTrsDetState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.analisisDeTrsDet
);

export const getAnalisisTrsDetEntities = createSelector(
  getAnalisisTrsDetState,
  fromAnalisis.selectEntities
);

export const selectAnalisisTrsDet = createSelector(
  getAnalisisTrsDetState,
  fromAnalisis.selectAll
);

export const selectAnalisisTrsDetLoading = createSelector(
  getAnalisisTrsDetState,
  fromAnalisis.getLoading
);
