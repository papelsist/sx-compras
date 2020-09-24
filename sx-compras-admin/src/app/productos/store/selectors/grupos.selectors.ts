import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromGrupos from '../reducers/grupos.reducer';

export const getGruposState = createSelector(
  fromFeature.getCatalogosState,
  (state: fromFeature.CatalogosState) => state.grupos
);

export const getGruposEntities = createSelector(
  getGruposState,
  fromGrupos.getGruposEntities
);

export const getAllGrupos = createSelector(
  getGruposEntities,
  entities => {
    return Object.keys(entities).map(id => entities[id]);
  }
);

export const getGruposLoaded = createSelector(
  getGruposState,
  fromGrupos.getGruposLoaded
);

export const getGruposLoading = createSelector(
  getGruposState,
  fromGrupos.getGruposLoading
);
