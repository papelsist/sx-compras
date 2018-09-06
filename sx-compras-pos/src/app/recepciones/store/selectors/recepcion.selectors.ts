import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromComs from '../reducers/recepcion.reducer';
import { RecepcionDeCompra } from '../../models/recepcionDeCompra';

import * as _ from 'lodash';

export const getComsState = createSelector(
  fromFeature.getRecepcionesState,
  (state: fromFeature.State) => state.coms
);

export const getRecepcionesDeCompraEntities = createSelector(
  getComsState,
  fromComs.selectEntities
);

export const getAllRecepcionesDeCompra = createSelector(
  getComsState,
  fromComs.selectAll
);

export const getComsLoaded = createSelector(
  getComsState,
  fromComs.getComsLoaded
);

export const getComsLoading = createSelector(
  getComsState,
  fromComs.getComsLoading
);

export const getSelectedRecepcionDeCompra = createSelector(
  getRecepcionesDeCompraEntities,
  fromRoot.getRouterState,
  (entities, router): RecepcionDeCompra => {
    return router.state && entities[router.state.params.comId];
  }
);

export const getSelectedComsIds = createSelector(
  getComsState,
  fromComs.getSelected
);

export const getSelectedComs = createSelector(
  getRecepcionesDeCompraEntities,
  getSelectedComsIds,
  (entities, ids) => {
    return ids.map(id => entities[id]);
  }
);

export const getSelectedPartidas = createSelector(getSelectedComs, compras =>
  compras
    .map(item => item.partidas)
    .reduce((acu, partidas) => [...acu, ...partidas], [])
);
