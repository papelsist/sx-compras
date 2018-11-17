import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromComisiones from '../reducers/comision.reducer';
import { Comision } from '../../models';

import * as _ from 'lodash';

export const getComisionesState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.comisiones
);

export const getComisionesEntities = createSelector(
  getComisionesState,
  fromComisiones.selectEntities
);

export const getAllComisiones = createSelector(
  getComisionesState,
  fromComisiones.selectAll
);

export const getComisionesLoaded = createSelector(
  getComisionesState,
  fromComisiones.getComisionesLoaded
);

export const getComisionesLoading = createSelector(
  getComisionesState,
  fromComisiones.getComisionesLoading
);

export const getSelectedComision = createSelector(
  getComisionesEntities,
  fromRoot.getRouterState,
  (entities, router): Comision => {
    return router.state && entities[router.state.params.comisionId];
  }
);

export const getComisionesFilter = createSelector(
  getComisionesState,
  fromComisiones.getComisionesFilter
);

export const getComisionesSearchTerm = createSelector(
  getComisionesState,
  fromComisiones.getComisionesSearchTerm
);
