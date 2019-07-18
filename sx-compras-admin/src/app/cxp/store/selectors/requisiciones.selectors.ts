import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromRequisicion from '../reducers/requisicion.reducer';
import { Requisicion } from '../../model';

import * as _ from 'lodash';

export const getRequisicionState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.requisiciones
);

export const getRequisicionEntities = createSelector(
  getRequisicionState,
  fromRequisicion.getRequisicionEntities
);

export const getAllRequisiciones = createSelector(
  getRequisicionEntities,
  entities => Object.keys(entities).map(id => entities[id])
);

export const getRequisicionesLoading = createSelector(
  getRequisicionState,
  fromRequisicion.getLoading
);

export const getRequisicionesLoaded = createSelector(
  getRequisicionState,
  fromRequisicion.getLoaded
);

export const getSelectedRequisicion = createSelector(
  getRequisicionEntities,
  fromRoot.getRouterState,
  (entities, router): Requisicion => {
    return router.state && entities[router.state.params.requisicionId];
  }
);

export const getPeriodoDeRequisiciones = createSelector(
  getRequisicionState,
  fromRequisicion.getPeriodo
);
