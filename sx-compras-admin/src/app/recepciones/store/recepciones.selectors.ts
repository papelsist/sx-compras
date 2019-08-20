import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './';
import * as fromComs from './recepciones.reducer';

import { RecepcionDeCompra } from '../models/recepcionDeCompra';

export const getComsState = createSelector(
  fromFeature.getRecepcionesState,
  (state: fromFeature.State) => state.recepciones
);

export const getRecepcionesEntities = createSelector(
  getComsState,
  fromComs.selectEntities
);

export const getAllRecepciones = createSelector(
  getComsState,
  fromComs.selectAll
);

export const getRecepcionesLoaded = createSelector(
  getComsState,
  fromComs.getRecepcionesLoaded
);

export const getRecepcionesLoading = createSelector(
  getComsState,
  fromComs.getRecepcionesLoading
);

export const getSelectedRecepcionDeCompra = createSelector(
  getRecepcionesEntities,
  fromRoot.getRouterState,
  (entities, router): RecepcionDeCompra => {
    return router.state && entities[router.state.params.comId];
  }
);

export const selectPeriodo = createSelector(
  getComsState,
  fromComs.getRecepcionesPeriodo
);
