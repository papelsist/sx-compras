import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromPagoDeNomina from '../reducers/pago-nomina.reducer';
import { PagoDeNomina } from '../../models';

import * as _ from 'lodash';

export const getPagoDeNominasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.pagoNominas
);

export const getPagoDeNominasEntities = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.selectEntities
);

export const getAllPagoDeNominas = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.selectAll
);

export const getPagoDeNominasLoaded = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.getPagoDeNominasLoaded
);

export const getPagoDeNominasLoading = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.getPagoDeNominasLoading
);

export const getSelectedPagoDeNomina = createSelector(
  getPagoDeNominasEntities,
  fromRoot.getRouterState,
  (entities, router): PagoDeNomina => {
    return router.state && entities[router.state.params.pagoId];
  }
);

export const getPagoDeNominasFilter = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.getPagoDeNominasFilter
);

export const getPagoDeNominasSearchTerm = createSelector(
  getPagoDeNominasState,
  fromPagoDeNomina.getPagoDeNominasSearchTerm
);
