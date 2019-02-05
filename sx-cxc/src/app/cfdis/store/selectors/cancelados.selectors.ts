import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromCancelados from '../reducers/cfdis-cancelados.reducer';

import { CfdiCancelado } from '../../models';

export const getCfdisCanceladosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cancelados
);

export const getCfdisCanceladosEntities = createSelector(
  getCfdisCanceladosState,
  fromCancelados.selectEntities
);

export const getAllCfdisCancelados = createSelector(
  getCfdisCanceladosState,
  fromCancelados.selectAll
);

export const getCfdisCanceladosLoaded = createSelector(
  getCfdisCanceladosState,
  fromCancelados.getCfdisCanceldadosLoaded
);

export const getCfdisCanceladosLoading = createSelector(
  getCfdisCanceladosState,
  fromCancelados.getCfdisCanceladosLoading
);

export const getSelectedCancelado = createSelector(
  getCfdisCanceladosEntities,
  fromRoot.getRouterState,
  (entities, router): CfdiCancelado => {
    return router.state && entities[router.state.params.canceladoId];
  }
);

export const getCfdisCanceladosFilter = createSelector(
  getCfdisCanceladosState,
  fromCancelados.getCfdisCanceladosFilter
);

export const getCfdisCanceladosSearchTerm = createSelector(
  getCfdisCanceladosState,
  fromCancelados.getCfdisCanceladosSearchTerm
);
