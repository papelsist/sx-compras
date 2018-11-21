import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromPagosMorralla from '../reducers/pago-morralla.reducer';
import { PagoDeMorralla } from '../../models';

import * as _ from 'lodash';

export const getPagoDeMorrallasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.morrallas
);

export const getPagoDeMorrallasEntities = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.selectEntities
);

export const getAllPagoDeMorrallas = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.selectAll
);

export const getPagoDeMorrallasLoaded = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.getPagoDeMorrallasLoaded
);

export const getPagoDeMorrallasLoading = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.getPagoDeMorrallasLoading
);

export const getSelectedPagoDeMorralla = createSelector(
  getPagoDeMorrallasEntities,
  fromRoot.getRouterState,
  (entities, router): PagoDeMorralla => {
    return router.state && entities[router.state.params.pagoId];
  }
);

export const getPagoDeMorrallasFilter = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.getPagoDeMorrallasFilter
);

export const getPagoDeMorrallasSearchTerm = createSelector(
  getPagoDeMorrallasState,
  fromPagosMorralla.getPagoDeMorrallasSearchTerm
);
