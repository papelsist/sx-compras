import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromFacturas from '../reducers/facturas.reducer';
import { CuentaPorPagar } from '../../model';

export const getFacturasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.facturas
);

export const getFacturasEntities = createSelector(
  getFacturasState,
  fromFacturas.selectEntities
);

export const getAllFacturas = createSelector(
  getFacturasState,
  fromFacturas.selectAll
);

export const getFacturasLoaded = createSelector(
  getFacturasState,
  fromFacturas.getFacturasLoaded
);

export const getFacturasLoading = createSelector(
  getFacturasState,
  fromFacturas.getFacturasLoading
);

export const getSelectedFactura = createSelector(
  getFacturasEntities,
  fromRoot.getRouterState,
  (entities, router): CuentaPorPagar => {
    return router.state && entities[router.state.params.facturaId];
  }
);

export const selectFacturasPeriodo = createSelector(
  getFacturasState,
  fromFacturas.getPeriodo
);

export const getFacturasFilter = createSelector(
  getFacturasState,
  fromFacturas.getFacturasFilter
);
