import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';
import { RequisicionDeMaterial } from '../models';

export const selectPeriodo = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.getPeriodo
);

export const getRequisicionesEntities = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.selectEntities
);

export const getAllRequisiciones = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.selectAll
);

export const selectPendientes = createSelector(
  getAllRequisiciones,
  requisiciones => requisiciones.filter(item => !item.compra)
);

export const selectRequisicionesLoaded = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.getLoaded
);

export const selectRequisicionesLoading = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.getLoading
);

export const getCurrentRequisicion = createSelector(
  getRequisicionesEntities,
  fromRoot.getRouterState,
  (entities, router): RequisicionDeMaterial => {
    return router.state && entities[router.state.params.requisicionId];
  }
);
