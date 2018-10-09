import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromPagos from '../reducers/pagos.reducer';
import { Pago } from '../../model';

import * as _ from 'lodash';

export const getPagosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.pagos
);

export const getPagosEntities = createSelector(
  getPagosState,
  fromPagos.selectEntities
);

export const getAllPagos = createSelector(getPagosState, fromPagos.selectAll);

export const getAllPagosPendientes = createSelector(getAllPagos, pagos => {
  return pagos.filter(item => item.disponible !== 0);
});

export const getAllPagosSorted = createSelector(getAllPagos, pagos => {
  return _.sortBy(pagos, 'modificado');
});

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

export const getPagosFilter = createSelector(
  getPagosState,
  fromPagos.getPagosFilter
);

export const getPagosSearchTerm = createSelector(
  getPagosState,
  fromPagos.getPagosSearchTerm
);
