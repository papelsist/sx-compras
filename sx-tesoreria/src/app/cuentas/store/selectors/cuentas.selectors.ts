import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromCuentas from '../reducers/cuentas.reducer';

import { CuentaDeBanco } from 'app/models';

import * as _ from 'lodash';

export const getCuentasState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.cuentas
);

export const getCuentasEntities = createSelector(
  getCuentasState,
  fromCuentas.selectEntities
);

export const getAllCuentas = createSelector(
  getCuentasState,
  fromCuentas.selectAll
);

export const getCuentasLoaded = createSelector(
  getCuentasState,
  fromCuentas.getCuentasLoaded
);

export const getCuentasLoading = createSelector(
  getCuentasState,
  fromCuentas.getCuentasLoading
);

export const getPeriodo = createSelector(
  getCuentasState,
  fromCuentas.getPeriodo
);

export const getSelectedCuentaId = createSelector(
  getCuentasState,
  fromCuentas.getSelectedCuentaId
);

export const getCurrentCuenta = createSelector(
  getCuentasEntities,
  fromRoot.getRouterState,
  (entities, router): CuentaDeBanco => {
    return router.state && entities[router.state.params.cuentaId];
  }
);
