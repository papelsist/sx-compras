import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFacturistas from '../reducers/facturistas.reducer';

export const getFacturistasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.facturistas
);

export const getFacturistasEntities = createSelector(
  getFacturistasState,
  fromFacturistas.selectEntities
);

export const getAllFacturistas = createSelector(
  getFacturistasState,
  fromFacturistas.selectAll
);

export const getFacturistasLoaded = createSelector(
  getFacturistasState,
  fromFacturistas.getFacturistasLoaded
);

export const getFacturistasLoading = createSelector(
  getFacturistasState,
  fromFacturistas.getFacturistasLoading
);
