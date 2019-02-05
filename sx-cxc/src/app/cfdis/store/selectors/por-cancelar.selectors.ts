import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromFeature from '../reducers';
import * as fromPorCancelar from '../reducers/por-cancelar.reducer';

import { Cfdi } from '../../models';

export const getPorCancelarState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.porCanelar
);

export const getPorCancelarEntities = createSelector(
  getPorCancelarState,
  fromPorCancelar.selectEntities
);

export const getAllPorCancelar = createSelector(
  getPorCancelarState,
  fromPorCancelar.selectAll
);

export const getPorCancelarLoaded = createSelector(
  getPorCancelarState,
  fromPorCancelar.getCfdisPorCancelarLoaded
);

export const getPorCancelarLoading = createSelector(
  getPorCancelarState,
  fromPorCancelar.getCfdisPorCancelarLoading
);
