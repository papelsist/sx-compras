import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromComprobantes from '../reducers/cfdi.reducer';

import { ComprobanteFiscal } from '../../model';

export const getComprobantesState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cfdis
);

export const getComprobantesEntities = createSelector(
  getComprobantesState,
  fromComprobantes.selectEntities
);

export const getAllComprobantes = createSelector(
  getComprobantesState,
  fromComprobantes.selectAll
);

export const getComprobantesLoaded = createSelector(
  getComprobantesState,
  fromComprobantes.getComprobantesLoaded
);

export const getComprobantesLoading = createSelector(
  getComprobantesState,
  fromComprobantes.getComprobantesLoading
);

export const getSelectedComprobante = createSelector(
  getComprobantesEntities,
  fromRoot.getRouterState,
  (entities, router): ComprobanteFiscal => {
    return router.state && entities[router.state.params.comprobanteId];
  }
);

export const getComprobantesFilter = createSelector(
  getComprobantesState,
  fromComprobantes.getComprobantesFilter
);

export const getComprobantesSearchTerm = createSelector(
  getComprobantesState,
  fromComprobantes.getComprobantesSearchTerm
);

export const getComprobantesSelectedIds = createSelector(
  getComprobantesState,
  fromComprobantes.getSelectedIds
);

export const getSelectedCfdis = createSelector(
  getComprobantesEntities,
  getComprobantesSelectedIds,
  (entities, ids) => ids.map(id => entities[id])
);

export const getSelectedConceptos = createSelector(getSelectedCfdis, cfdis => {
  const res = [];
  cfdis.forEach(item => res.push(...item.conceptos));
  return res;
});
