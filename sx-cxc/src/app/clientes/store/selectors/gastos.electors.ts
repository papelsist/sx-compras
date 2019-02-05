import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromCobradores from '../reducers/cobrador.reducer';
import { Cobrador } from '../../models';

import * as _ from 'lodash';

export const getCobradoresState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cobradores
);

export const getCobradoresEntities = createSelector(
  getCobradoresState,
  fromCobradores.selectEntities
);

export const getCobradores = createSelector(
  getCobradoresState,
  fromCobradores.selectAll
);

export const getCobradoresLoading = createSelector(
  getCobradoresState,
  fromCobradores.getCobradoresLoading
);

export const getSelectedCobrador = createSelector(
  getCobradoresEntities,
  fromRoot.getRouterState,
  (entities, router): Cobrador => {
    return router.state && entities[router.state.params.cobradorId];
  }
);

export const getCobradoresLoaded = createSelector(
  getCobradoresState,
  fromCobradores.getCobradoresLoaded
);
