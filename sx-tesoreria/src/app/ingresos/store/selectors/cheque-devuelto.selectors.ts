import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromChequeDevueltos from '../reducers/cheque-devuelto.reducer';
import { ChequeDevuelto } from '../../models';

export const getChequeDevueltosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.chequesdevueltos
);

export const getChequeDevueltosEntities = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.selectEntities
);

export const getAllChequeDevueltos = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.selectAll
);

export const getChequeDevueltosLoaded = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.getChequeDevueltosLoaded
);

export const getChequeDevueltosLoading = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.getChequeDevueltosLoading
);

export const getSelectedChequeDevuelto = createSelector(
  getChequeDevueltosEntities,
  fromRoot.getRouterState,
  (entities, router): ChequeDevuelto => {
    return router.state && entities[router.state.params.cobroId];
  }
);

export const getChequeDevueltosFilter = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.getChequeDevueltosFilter
);

export const getChequeDevueltosSearchTerm = createSelector(
  getChequeDevueltosState,
  fromChequeDevueltos.getChequeDevueltosSearchTerm
);
