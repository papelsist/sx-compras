import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';
import { Existencia } from '../models';

export const selectPeriodo = createSelector(
  fromFeature.getExistenciasState,
  fromFeature.getPeriodo
);

export const getExistenciasEntities = createSelector(
  fromFeature.getExistenciasState,
  fromFeature.selectEntities
);

export const getAllExistencias = createSelector(
  fromFeature.getExistenciasState,
  fromFeature.selectAll
);

export const selectExistenciasLoaded = createSelector(
  fromFeature.getExistenciasState,
  fromFeature.getLoaded
);

export const selectExistenciasLoading = createSelector(
  fromFeature.getExistenciasState,
  fromFeature.getLoading
);

export const getCurrentExistencia = createSelector(
  getExistenciasEntities,
  fromRoot.getRouterState,
  (entities, router): Existencia => {
    return router.state && entities[router.state.params.exisId];
  }
);
