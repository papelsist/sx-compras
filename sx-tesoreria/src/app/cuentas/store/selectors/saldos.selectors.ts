import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from '../reducers';
import * as fromSaldos from '../reducers/saldos.reducre';
import * as fromCuentas from '../selectors/cuentas.selectors';

import { SaldoPorCuenta } from '../../models/saldoPorCuenta';

import * as _ from 'lodash';

export const getSaldosState = createSelector(
  fromFeature.getState,
  (state: fromFeature.State) => state.saldos
);

export const getSaldosEntities = createSelector(
  getSaldosState,
  fromSaldos.selectEntities
);

export const getAllSaldos = createSelector(
  getSaldosState,
  fromSaldos.selectAll
);

export const getSaldosLoaded = createSelector(
  getSaldosState,
  fromSaldos.getSaldosLoaded
);

export const getSaldosLoading = createSelector(
  getSaldosState,
  fromSaldos.getSaldosLoading
);

export const getCurrentSaldo = createSelector(getAllSaldos, (saldos, props) =>
  saldos.find(
    item => item.ejercicio === props.ejercicio && item.mes === props.mes
  )
);

export const getCurrentSaldo2 = createSelector(
  getAllSaldos,
  fromCuentas.getPeriodo,
  (saldos, periodo) =>
    saldos.find(
      item => item.ejercicio === periodo.ejercicio && item.mes === periodo.mes
    )
);
