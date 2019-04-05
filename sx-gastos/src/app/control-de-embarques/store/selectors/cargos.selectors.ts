import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../../store/reducers';
import * as fromCargos from '../reducers/cargos.reducer';

import { FacturistaCargo } from '../../model';

export const getCargosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cargos
);

export const getCargosEntity = createSelector(
  getCargosState,
  fromCargos.selectEntities
);

export const getAllCargos = createSelector(
  getCargosState,
  fromCargos.selectAll
);

export const getCargosLoaded = createSelector(
  getCargosState,
  fromCargos.getCargosLoaded
);

export const getCargosLoading = createSelector(
  getCargosState,
  fromCargos.getCargosLoading
);

export const getCargosFilter = createSelector(
  getCargosState,
  fromCargos.getCargosFilter
);

export const getCargosPeriodo = createSelector(
  getCargosFilter,
  filter => filter.periodo
);

export const getCargosSearch = createSelector(
  getCargosState,
  fromCargos.getCargosSearchTerm
);

export const getSelectedCargo = createSelector(
  getCargosState,
  fromRoot.getRouterState,
  (entities, router): FacturistaCargo => {
    return router.state && entities[router.state.params.prestamoId];
  }
);
