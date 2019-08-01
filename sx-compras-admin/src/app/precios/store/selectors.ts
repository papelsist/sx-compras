import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';
import { ListaDePreciosVenta } from '../models';

export const selectPeriodo = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.getPeriodo
);

export const getListasEntities = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.selectEntities
);

export const getAllListas = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.selectAll
);

export const selectListasLoaded = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.getLoaded
);

export const selectListasLoading = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.getLoading
);

export const getCurrentCambio = createSelector(
  getListasEntities,
  fromRoot.getRouterState,
  (entities, router): ListaDePreciosVenta => {
    return router.state && entities[router.state.params.listaId];
  }
);

export const selectDisponibles = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.getDisponibles
);
export const selectDisponiblesLoaded = createSelector(
  fromFeature.getListaDePreciosState,
  fromFeature.getDisponiblesLoaded
);
