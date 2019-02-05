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
  fromRequisicion.selectEntities
);

export const getAllRequisiciones = createSelector(
  getRequisicionState,
  fromRequisicion.selectAll
);

export const getRequisicionLoading = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionLoading
);

export const getSelectedRequisicion = createSelector(
  getRequisicionEntities,
  fromRoot.getRouterState,
  (entities, router): Requisicion => {
    return router.state && entities[router.state.params.requisicionId];
  }
);

export const getRequisicionesLoaded = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionLoaded
);

export const getRequisicionesFilter = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionesFilter
);
