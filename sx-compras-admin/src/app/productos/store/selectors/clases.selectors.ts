import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromClases from '../reducers/clases.reducer';

export const getClasesState = createSelector(
  fromFeature.getCatalogosState,
  (state: fromFeature.CatalogosState) => state.clases
);

export const getClasesEntities = createSelector(
  getClasesState,
  fromClases.getClasesEntities
);

export const getAllClases = createSelector(getClasesEntities, entities =>
  Object.keys(entities).map(id => entities[id])
);

export const getClasesLoading = createSelector(
  getClasesState,
  fromClases.getClasesLoading
);

export const getClasesLoaded = createSelector(
  getClasesState,
  fromClases.getClasesLoaded
);
