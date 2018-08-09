import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromPagos from '../reducers/pagos.reducer';
import { Pago } from '../../model';

export const getPagosState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.pagos
);

export const getPagosEntities = createSelector(
  getPagosState,
  fromPagos.selectEntities
);

export const getAllPagos = createSelector(getPagosState, fromPagos.selectAll);

export const getAllPagosPendientes = createSelector(getAllPagos, pagos =>
  pagos.filter(item => item.disponible !== 0)
);

export const getPagosLoaded = createSelector(
  getPagosState,
  fromPagos.getPagosLoaded
);

export const getPagosLoading = createSelector(
  getPagosState,
  fromPagos.getPagosLoading
);

export const getSelectedPago = createSelector(
  getPagosEntities,
  fromRoot.getRouterState,
  (entities, router): Pago => {
    return router.state && entities[router.state.params.pagoId];
  }
);
