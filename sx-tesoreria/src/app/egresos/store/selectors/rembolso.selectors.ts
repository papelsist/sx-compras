import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromRembolsos from '../reducers/rembolso.reducers';
import { Rembolso } from '../../models';

import * as _ from 'lodash';

export const getRembolsosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.rembolsos
);

export const getRembolsosEntities = createSelector(
  getRembolsosState,
  fromRembolsos.selectEntities
);

export const getAllRembolsos = createSelector(
  getRembolsosState,
  fromRembolsos.selectAll
);

export const getRembolsosLoaded = createSelector(
  getRembolsosState,
  fromRembolsos.getRembolsosLoaded
);

export const getRembolsosLoading = createSelector(
  getRembolsosState,
  fromRembolsos.getRembolsosLoading
);

export const getSelectedRembolso = createSelector(
  getRembolsosEntities,
  fromRoot.getRouterState,
  (entities, router): Rembolso => {
    return router.state && entities[router.state.params.rembolsoId];
  }
);

export const getRembolsosFilter = createSelector(
  getRembolsosState,
  fromRembolsos.getRembolsosFilter
);

export const getRembolsosSearchTerm = createSelector(
  getRembolsosState,
  fromRembolsos.getRembolsosSearchTerm
);
