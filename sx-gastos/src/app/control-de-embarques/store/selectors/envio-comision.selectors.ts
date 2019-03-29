import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromEnvioComision from '../reducers/envio-comision.reducers';
import { EnvioComision } from '../../model';

import * as _ from 'lodash';

export const getEnvioComisionState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.envioComisiones
);

export const getEnvioComisionEntities = createSelector(
  getEnvioComisionState,
  fromEnvioComision.selectEntities
);

export const getAllEnvioComision = createSelector(
  getEnvioComisionState,
  fromEnvioComision.selectAll
);

export const getEnvioComisionLoaded = createSelector(
  getEnvioComisionState,
  fromEnvioComision.getEnvioComisionLoaded
);

export const getEnvioComisionLoading = createSelector(
  getEnvioComisionState,
  fromEnvioComision.getEnvioComisionLoading
);

export const getSelectedEnvioComision = createSelector(
  getEnvioComisionEntities,
  fromRoot.getRouterState,
  (entities, router): EnvioComision => {
    return router.state && entities[router.state.params.envioComisionId];
  }
);

export const getEnvioComisionFilter = createSelector(
  getEnvioComisionState,
  fromEnvioComision.getEnvioComisionFilter
);

export const getEnvioComisionSearchTerm = createSelector(
  getEnvioComisionState,
  fromEnvioComision.getEnvioComisionSearchTerm
);
