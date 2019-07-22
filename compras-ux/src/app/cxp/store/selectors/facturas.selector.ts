import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromFacturas from '../reducers/facturas.reducer';
import { CuentaPorPagar } from '../../model';

export const getFacturasState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.facturas
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

export const getPeriodoDeFacturas = createSelector(
  getFacturasState,
  fromFacturas.getFacturasPeriodo
);

export const selectCartera = createSelector(
  getAllFacturas,
  facturas => (id: string) => facturas.filter(item => item.proveedor.id === id)
);
