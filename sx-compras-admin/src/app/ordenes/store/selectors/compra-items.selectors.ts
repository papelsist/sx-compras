import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromCompraItems from '../reducers/compra-items.reducer';

export const getCompraItemsState = createSelector(
  fromFeature.getOrdenesState,
  (state: fromFeature.State) => state.compraItems
);

export const getCompraItemsEntities = createSelector(
  getCompraItemsState,
  fromCompraItems.selectEntities
);

export const getAllItems = createSelector(
  getCompraItemsState,
  fromCompraItems.selectAll
);

export const getCompraItemsLoaded = createSelector(
  getCompraItemsState,
  fromCompraItems.getCompraItemsLoaded
);

export const getCompraItemsLoading = createSelector(
  getCompraItemsState,
  fromCompraItems.getCompraItemsLoading
);
