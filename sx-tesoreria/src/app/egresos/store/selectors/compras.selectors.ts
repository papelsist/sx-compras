import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromCompras from '../reducers/compras.reducer';
import { Requisicion } from '../../models';

import * as _ from 'lodash';

export const getComprasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.compras
);

export const getComprasEntities = createSelector(
  getComprasState,
  fromCompras.selectEntities
);

export const getCompras = createSelector(
  getComprasState,
  fromCompras.selectAll
);

export const getComprasLoading = createSelector(
  getComprasState,
  fromCompras.getComprasLoading
);

export const getSelectedCompra = createSelector(
  getComprasEntities,
  fromRoot.getRouterState,
  (entities, router): Requisicion => {
    return router.state && entities[router.state.params.requisicionId];
  }
);

export const getComprasLoaded = createSelector(
  getComprasState,
  fromCompras.getComprasLoaded
);

export const getComprasFilter = createSelector(
  getComprasState,
  fromCompras.getComprasFilter
);
