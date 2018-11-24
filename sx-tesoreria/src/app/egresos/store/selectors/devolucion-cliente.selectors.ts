import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromDevoluciones from '../reducers/devolucion-cliente.reducer';
import { DevolucionCliente } from '../../models';

import * as _ from 'lodash';

export const getDevolucionClienteState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.devoluciones
);

export const getDevolucionClienteEntities = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.selectEntities
);

export const getAllDevolucionCliente = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.selectAll
);

export const getDevolucionClienteLoaded = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.getDevolucionClienteLoaded
);

export const getDevolucionClienteLoading = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.getDevolucionClienteLoading
);

export const getSelectedDevolucionCliente = createSelector(
  getDevolucionClienteEntities,
  fromRoot.getRouterState,
  (entities, router): DevolucionCliente => {
    return router.state && entities[router.state.params.devoId];
  }
);

export const getDevolucionClienteFilter = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.getDevolucionClienteFilter
);

export const getDevolucionClienteSearchTerm = createSelector(
  getDevolucionClienteState,
  fromDevoluciones.getDevolucionClienteSearchTerm
);
