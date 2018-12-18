import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromCfdis from '../reducers/cfdis.reducer';

import { Cfdi } from '../../models';

export const getCfdisState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cfdis
);

export const getCfdisEntities = createSelector(
  getCfdisState,
  fromCfdis.selectEntities
);

export const getAllCfdis = createSelector(
  getCfdisState,
  fromCfdis.selectAll
);

export const getCfdisLoaded = createSelector(
  getCfdisState,
  fromCfdis.getCfdisLoaded
);

export const getCfdisLoading = createSelector(
  getCfdisState,
  fromCfdis.getCfdisLoading
);

export const getSelectedComprobante = createSelector(
  getCfdisEntities,
  fromRoot.getRouterState,
  (entities, router): Cfdi => {
    return router.state && entities[router.state.params.cfdiId];
  }
);

export const getCfdisFilter = createSelector(
  getCfdisState,
  fromCfdis.getCfdisFilter
);

export const getCfdisSearchTerm = createSelector(
  getCfdisState,
  fromCfdis.getCfdisSearchTerm
);
