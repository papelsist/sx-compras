import { createSelector } from '@ngrx/store';

import { Devolucion } from 'app/cobranza/models';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromDevoluciones from '../reducers/devolucion.reducer';

export const getDevolucionState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.devolucion
);

export const getDevolucionEntities = createSelector(
  getDevolucionState,
  fromDevoluciones.selectEntities
);
export const getAllDevoluciones = createSelector(
  getDevolucionState,
  fromDevoluciones.selectAll
);

export const getDevolucionLoading = createSelector(
  getDevolucionState,
  fromDevoluciones.getLoading
);

export const getDevolucionLoaded = createSelector(
  getDevolucionState,
  fromDevoluciones.getLoaded
);

export const getSelectedDevolucion = createSelector(
  getDevolucionEntities,
  fromRoot.getRouterState,
  (entities, router): Devolucion => {
    return router.state && entities[router.state.params.notaId];
  }
);
