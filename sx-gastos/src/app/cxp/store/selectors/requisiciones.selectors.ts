import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromRequisicion from '../reducers/requisicion.reducer';
import { Requisicion } from '../../model';

import * as _ from 'lodash';

export const getRequisicionState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.requisiciones
);

export const getRequisicionEntities = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionEntities
);

export const getAllRequisiciones = createSelector(
  getRequisicionEntities,
  entities => _.sortBy(Object.keys(entities).map(id => entities[id]), 'id')
);

export const getRequisicionLoading = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionLoading
);

export const getRequisicionLoaded = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionLoaded
);

export const getSelectedRequisicion = createSelector(
  getRequisicionEntities,
  fromRoot.getRouterState,
  (entities, router): Requisicion => {
    return router.state && entities[router.state.params.requisicionId];
  }
);
