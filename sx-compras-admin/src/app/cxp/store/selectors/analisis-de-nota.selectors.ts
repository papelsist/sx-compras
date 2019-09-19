import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAnalisis from '../reducers/analisis-de-nota.reducer';

import * as _ from 'lodash';

export const getAnalisisDeNotaState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.analisisDeNota
);

export const getAnalisisDeNotaEntities = createSelector(
  getAnalisisDeNotaState,
  fromAnalisis.selectEntities
);

export const selectAnalisisDeNota = createSelector(
  getAnalisisDeNotaState,
  fromAnalisis.selectAll
);

export const selectAnalisisDeNotaLoading = createSelector(
  getAnalisisDeNotaState,
  fromAnalisis.getLoading
);
