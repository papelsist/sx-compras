import { createSelector } from '@ngrx/store';

import * as _ from 'lodash';

import * as fromFeature from '../reducers';
import * as fromMarcas from '../reducers/marcas.reducer';
import { Marca } from '../../models/marca';

export const getMarcasState = createSelector(
  fromFeature.getCatalogosState,
  (state: fromFeature.CatalogosState) => state.marcas
);

export const getMarcasEntities = createSelector(
  getMarcasState,
  fromMarcas.getMarcasEntities
);

export const getAllMarcas = createSelector(getMarcasEntities, entities =>
  _.sortBy(Object.keys(entities).map(id => entities[id]), 'marca')
);

export const getMarcasLoading = createSelector(
  getMarcasState,
  fromMarcas.getMarcasLoading
);

export const getMarcasLoaded = createSelector(
  getMarcasState,
  fromMarcas.getMarcasLoaded
);
