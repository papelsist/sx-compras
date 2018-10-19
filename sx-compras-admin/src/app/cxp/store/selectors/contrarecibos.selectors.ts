import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromContrarecibos from '../reducers/contrarecibos.reducer';

import { Contrarecibo } from '../../model';

export const getContrarecibosState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.contrarecibos
);

export const getContrarecibosEntities = createSelector(
  getContrarecibosState,
  fromContrarecibos.selectEntities
);

export const getAllContrarecibos = createSelector(
  getContrarecibosState,
  fromContrarecibos.selectAll
);

export const getContrarecibosLoaded = createSelector(
  getContrarecibosState,
  fromContrarecibos.getContrarecibosLoaded
);

export const getContrarecibosLoading = createSelector(
  getContrarecibosState,
  fromContrarecibos.getContrarecibosLoading
);

export const getSelectedContrarecibo = createSelector(
  getContrarecibosEntities,
  fromRoot.getRouterState,
  (entities, router): Contrarecibo => {
    return router.state && entities[router.state.params.reciboId];
  }
);

export const getContrarecibosFilter = createSelector(
  getContrarecibosState,
  fromContrarecibos.getContrarecibosFilter
);
