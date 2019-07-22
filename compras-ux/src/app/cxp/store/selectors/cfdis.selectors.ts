import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromComprobantes from '../reducers/cfdi.reducer';
import { ComprobanteFiscal } from '../../model';

export const getComprobantesState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.cfdis
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
