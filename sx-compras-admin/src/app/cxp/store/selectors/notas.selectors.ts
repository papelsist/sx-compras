import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromNotas from '../reducers/notas.reducers';
import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';

export const getNotasState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.notas
);

export const getNotasEntities = createSelector(
  getNotasState,
  fromNotas.selectEntities
);

export const getAllNotas = createSelector(
  getNotasState,
  fromNotas.selectAll
);

export const getDevluciones = createSelector(
  getAllNotas,
  notas => notas.filter(item => !item.concepto.startsWith('DESCUENTO'))
);

export const getNotasLoaded = createSelector(
  getNotasState,
  fromNotas.getNotasLoaded
);

export const getNotasLoading = createSelector(
  getNotasState,
  fromNotas.getNotasLoading
);

export const getSelectedNota = createSelector(
  getNotasEntities,
  fromRoot.getRouterState,
  (entities, router): NotaDeCreditoCxP => {
    return router.state && entities[router.state.params.notaId];
  }
);

export const getPeriodoDeNotas = createSelector(
  getNotasState,
  fromNotas.getPeriodo
);

export const getNotasSearchTerm = createSelector(
  getNotasState,
  fromNotas.getSearchTerm
);
