import { createSelector } from '@ngrx/store';

import { NotaDeCredito } from '../../models';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromNotas from '../reducers/nota-de-credito.reducer';

export const getNotaDeCreditoState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.notas
);

export const getNotaDeCreditoEntities = createSelector(
  getNotaDeCreditoState,
  fromNotas.selectEntities
);
export const getAllNotas = createSelector(
  getNotaDeCreditoState,
  fromNotas.selectAll
);

export const getNotasDeCreditoLoading = createSelector(
  getNotaDeCreditoState,
  fromNotas.getLoading
);

export const getNotasDeCreditoLoaded = createSelector(
  getNotaDeCreditoState,
  fromNotas.getLoaded
);

export const getSelectedNotaDeCredito = createSelector(
  getNotaDeCreditoEntities,
  fromRoot.getRouterState,
  (entities, router): NotaDeCredito => {
    console.log('Locating: ', router);
    return router.state && entities[router.state.params.notaId];
  }
);

export const getNotasCartera = createSelector(
  getNotaDeCreditoState,
  fromNotas.getCartera
);
