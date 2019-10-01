import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromAnalisis from '../reducers/analisis-de-transformacion.reducer';

import * as _ from 'lodash';
import { AnalisisDeTransformacion } from 'app/cxp/model';

export const getAnalisisDeTransformacionState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.analisisDeTransformacion
);

export const getAnalisisDeTransformacionEntities = createSelector(
  getAnalisisDeTransformacionState,
  fromAnalisis.selectEntities
);

export const selectAnalisisDeTransformacion = createSelector(
  getAnalisisDeTransformacionState,
  fromAnalisis.selectAll
);

export const selectAnalisisDeTransformacionLoading = createSelector(
  getAnalisisDeTransformacionState,
  fromAnalisis.getLoading
);
export const selectAnalisisDeTransformacionLoaded = createSelector(
  getAnalisisDeTransformacionState,
  fromAnalisis.getLoaded
);

export const selectCurrentAnalisisDeTrs = createSelector(
  getAnalisisDeTransformacionEntities,
  fromRoot.getRouterState,
  (entities, router): AnalisisDeTransformacion => {
    return router.state && entities[router.state.params.analisisId];
  }
);

export const selectTotalDeAnalisis = createSelector(
  getAnalisisDeTransformacionState,
  fromAnalisis.selectTotal,
  (state, total) => {
    return { rows: total };
  }
);
