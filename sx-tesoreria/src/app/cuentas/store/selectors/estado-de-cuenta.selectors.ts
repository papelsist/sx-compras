import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromEstado from '../reducers/estado-de-cuenta.reducer';

import { EstadoDeCuenta } from '../../models/estado-de-cuenta';

export const getEstadoDeCuentaState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.estadoDeCuenta
);

export const getEstadoDeCuentaLoading = createSelector(
  getEstadoDeCuentaState,
  fromEstado.getEstadoLoading
);

export const getEstadoDeCuenta = createSelector(
  getEstadoDeCuentaState,
  fromEstado.getEstadoDeCuenta
);

export const getMovimientos = createSelector(
  getEstadoDeCuenta,
  estado => (estado ? estado.movimientos : [])
);
