import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromSolicitudes from '../reducers/solicitud.reducer';

import { SolicitudDeDeposito } from '../../models';

export const getSolicitudesState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.solicitudes
);

export const getSolicitudesCartera = createSelector(
  getSolicitudesState,
  fromSolicitudes.getCartera
);

export const getSolicitudesEntities = createSelector(
  getSolicitudesState,
  fromSolicitudes.selectEntities
);

export const getAllSolicitudes = createSelector(
  getSolicitudesState,
  fromSolicitudes.selectAll
);

export const getSolicitudesLoaded = createSelector(
  getSolicitudesState,
  fromSolicitudes.getSolicitudesLoaded
);

export const getSolicitudesLoading = createSelector(
  getSolicitudesState,
  fromSolicitudes.getSolicitudesLoading
);

export const getSolicitudesFilter = createSelector(
  getSolicitudesState,
  fromSolicitudes.getSolicitudesFilter
);

export const getSolicitudesSearchTerm = createSelector(
  getSolicitudesState,
  fromSolicitudes.getSolicitudesSearchTerm
);

export const getSelectedSolicitud = createSelector(
  getSolicitudesEntities,
  fromRoot.getRouterState,
  (entities, router): SolicitudDeDeposito => {
    return router.state && entities[router.state.params.solicitudId];
  }
);
