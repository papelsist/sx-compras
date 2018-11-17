import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromCompraMoneda from '../reducers/compra-moneda.reducer';
import { CompraMoneda } from '../../models';

import * as _ from 'lodash';

export const getCompraMonedasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.compraMonedas
);

export const getCompraMonedasEntities = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.selectEntities
);

export const getAllCompraMonedas = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.selectAll
);

export const getCompraMonedasLoaded = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.getCompraMonedasLoaded
);

export const getCompraMonedasLoading = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.getCompraMonedasLoading
);

export const getSelectedCompraMoneda = createSelector(
  getCompraMonedasEntities,
  fromRoot.getRouterState,
  (entities, router): CompraMoneda => {
    return router.state && entities[router.state.params.compraId];
  }
);

export const getCompraMonedasFilter = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.getCompraMonedasFilter
);

export const getCompraMonedasSearchTerm = createSelector(
  getCompraMonedasState,
  fromCompraMoneda.getCompraMonedasSearchTerm
);
