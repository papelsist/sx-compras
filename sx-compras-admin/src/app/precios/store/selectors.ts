import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';
import { CambioDePrecio } from '../models';

export const selectPeriodo = createSelector(
  fromFeature.getCambiosDePrecioState,
  fromFeature.getPeriodo
);

export const getCambiosDePrecioEntities = createSelector(
  fromFeature.getCambiosDePrecioState,
  fromFeature.selectEntities
);

export const getAllCambios = createSelector(
  fromFeature.getCambiosDePrecioState,
  fromFeature.selectAll
);

export const selectCambiosLoaded = createSelector(
  fromFeature.getCambiosDePrecioState,
  fromFeature.getLoaded
);

export const selectCambiosLoading = createSelector(
  fromFeature.getCambiosDePrecioState,
  fromFeature.getLoading
);

export const getCurrentCambio = createSelector(
  getCambiosDePrecioEntities,
  fromRoot.getRouterState,
  (entities, router): CambioDePrecio => {
    return router.state && entities[router.state.params.cambioId];
  }
);
