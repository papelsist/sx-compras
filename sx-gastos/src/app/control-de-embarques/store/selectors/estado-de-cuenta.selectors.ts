import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

import * as fromEstadoDeCuenta from '../reducers/estado-de-cuenta.reducer';

export const getEstadoDeCuentaState = createSelector(
  fromFeature.getState,
  state => state.estadoDeCuenta
);

export const getSelectedFacturista = createSelector(
  getEstadoDeCuentaState,
  fromEstadoDeCuenta.selectedFacturista
);

export const getEstadoDeCuentaEntities = createSelector(
  getEstadoDeCuentaState,
  fromEstadoDeCuenta.selectEntities
);
export const getAllRowsEstadoDeCuenta = createSelector(
  getEstadoDeCuentaState,
  fromEstadoDeCuenta.selectAll
);

export const getEstadoDeCuentaLoading = createSelector(
  getEstadoDeCuentaState,
  fromEstadoDeCuenta.selectLoading
);
