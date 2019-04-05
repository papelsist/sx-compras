import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../../store/reducers';
import * as fromPrestamos from '../reducers/prestamo.reducer';

import { FacturistaPrestamo } from '../../model';

export const getPrestamosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.prestamos
);

export const getPrestamosEntity = createSelector(
  getPrestamosState,
  fromPrestamos.selectEntities
);

export const getAllPrestamos = createSelector(
  getPrestamosState,
  fromPrestamos.selectAll
);

export const getPrestamosLoaded = createSelector(
  getPrestamosState,
  fromPrestamos.getPrestamosLoaded
);

export const getPrestamosLoading = createSelector(
  getPrestamosState,
  fromPrestamos.getPrestamosLoading
);

export const getPrestamosFilter = createSelector(
  getPrestamosState,
  fromPrestamos.getPrestamosFilter
);

export const getPrestamosPeriodo = createSelector(
  getPrestamosFilter,
  filter => filter.periodo
);

export const getPrestamosSearch = createSelector(
  getPrestamosState,
  fromPrestamos.getPrestamosSearchTerm
);

export const getSelectedPrestamo = createSelector(
  getPrestamosState,
  fromRoot.getRouterState,
  (entities, router): FacturistaPrestamo => {
    return router.state && entities[router.state.params.prestamoId];
  }
);
