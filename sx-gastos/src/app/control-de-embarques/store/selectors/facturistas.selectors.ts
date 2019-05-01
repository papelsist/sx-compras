import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromFacturistas from '../reducers/facturistas.reducer';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

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

export const getCurrentFacturista = createSelector(
  getFacturistasEntities,
  fromRoot.getRouterState,
  (entities, router): FacturistaDeEmbarque => {
    return router.state && entities[router.state.params.facturistaId];
  }
);
