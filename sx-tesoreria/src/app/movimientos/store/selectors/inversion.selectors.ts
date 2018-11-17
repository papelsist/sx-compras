import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromInversiones from '../reducers/inversion.reducers';
import { Inversion } from '../../models/inversion';

import * as _ from 'lodash';

export const getInversionesState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.inversiones
);

export const getInversionesEntities = createSelector(
  getInversionesState,
  fromInversiones.selectEntities
);

export const getAllInversiones = createSelector(
  getInversionesState,
  fromInversiones.selectAll
);

export const getInversionesLoaded = createSelector(
  getInversionesState,
  fromInversiones.getInversionesLoaded
);

export const getInversionesLoading = createSelector(
  getInversionesState,
  fromInversiones.getInversionesLoading
);

export const getSelectedInversion = createSelector(
  getInversionesEntities,
  fromRoot.getRouterState,
  (entities, router): Inversion => {
    return router.state && entities[router.state.params.inversionId];
  }
);

export const getInversionesFilter = createSelector(
  getInversionesState,
  fromInversiones.getInversionesFilter
);

export const getInversionesSearchTerm = createSelector(
  getInversionesState,
  fromInversiones.getInversionesSearchTerm
);
