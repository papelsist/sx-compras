import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromTraspasos from '../reducers/traspaso.reducers';
import { Traspaso } from '../../models/traspaso';

import * as _ from 'lodash';

export const getTraspasosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.traspasos
);

export const getTraspasosEntities = createSelector(
  getTraspasosState,
  fromTraspasos.selectEntities
);

export const getAllTraspasos = createSelector(
  getTraspasosState,
  fromTraspasos.selectAll
);

export const getTraspasosLoaded = createSelector(
  getTraspasosState,
  fromTraspasos.getTraspasosLoaded
);

export const getTraspasosLoading = createSelector(
  getTraspasosState,
  fromTraspasos.getTraspasosLoading
);

export const getSelectedTraspaso = createSelector(
  getTraspasosEntities,
  fromRoot.getRouterState,
  (entities, router): Traspaso => {
    return router.state && entities[router.state.params.traspasoId];
  }
);

export const getTraspasosFilter = createSelector(
  getTraspasosState,
  fromTraspasos.getTraspasosFilter
);

export const getTraspasosSearchTerm = createSelector(
  getTraspasosState,
  fromTraspasos.getTraspasosSearchTerm
);
