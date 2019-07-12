import { createSelector } from '@ngrx/store';

import { NotaDeCargo } from '../../models';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromNotas from '../reducers/nota-de-cargo.reducer';

export const getNotasDeCargoState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.notasDeCargo
);

export const getNotasDeCargoEntities = createSelector(
  getNotasDeCargoState,
  fromNotas.selectEntities
);
export const getAllNotasDeCargo = createSelector(
  getNotasDeCargoState,
  fromNotas.selectAll
);

export const getNotasDeCargoLoading = createSelector(
  getNotasDeCargoState,
  fromNotas.getLoading
);

export const getSelectedNotaDeCargo = createSelector(
  getNotasDeCargoEntities,
  fromRoot.getRouterState,
  (entities, router): NotaDeCargo => {
    return router.state && entities[router.state.params.notaId];
  }
);

export const getNotasDeCargoSearchTerm = createSelector(
  getNotasDeCargoState,
  fromNotas.getSearchTerm
);
