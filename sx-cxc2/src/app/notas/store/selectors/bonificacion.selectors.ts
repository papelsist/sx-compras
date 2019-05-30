import { createSelector } from '@ngrx/store';

import { Bonificacion } from 'app/cobranza/models';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromBonificaciones from '../reducers/bonificacion.reducer';

export const getBonificacionState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.bonificacion
);

export const getBonificacionEntities = createSelector(
  getBonificacionState,
  fromBonificaciones.selectEntities
);
export const getAllBonificaciones = createSelector(
  getBonificacionState,
  fromBonificaciones.selectAll
);

export const getBonificacionLoading = createSelector(
  getBonificacionState,
  fromBonificaciones.getLoading
);

export const getBonificacionLoaded = createSelector(
  getBonificacionState,
  fromBonificaciones.getLoaded
);

export const getSelectedBonificacion = createSelector(
  getBonificacionEntities,
  fromRoot.getRouterState,
  (entities, router): Bonificacion => {
    return router.state && entities[router.state.params.notaId];
  }
);
