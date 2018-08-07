import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromDisponibles from '../reducers/productos-disponibles.reducer';

export const getProductosDisponiblesState = createSelector(
  fromFeature.getOrdenesState,
  (state: fromFeature.State) => state.disponibles
);

export const getProductosDisponiblesEntities = createSelector(
  getProductosDisponiblesState,
  fromDisponibles.selectEntities
);

export const getAllProductosDisponibles = createSelector(
  getProductosDisponiblesState,
  fromDisponibles.selectAll
);

export const getProductosDisponiblesLoaded = createSelector(
  getProductosDisponiblesState,
  fromDisponibles.getProductosDisponiblesLoaded
);

export const getProductosDisponiblesLoading = createSelector(
  getProductosDisponiblesState,
  fromDisponibles.getProductosDisponiblesLoading
);
