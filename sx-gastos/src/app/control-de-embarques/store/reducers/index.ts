import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFacturistas from './facturistas.reducer';
import * as fromEnvioComision from './envio-comision.reducers';
import * as fromPrestamos from './prestamo.reducer';
import * as fromCargos from './cargos.reducer';
import * as fromEstadoDeCuenta from './estado-de-cuenta.reducer';

export interface State {
  facturistas: fromFacturistas.State;
  envioComisiones: fromEnvioComision.State;
  prestamos: fromPrestamos.State;
  cargos: fromCargos.State;
  estadoDeCuenta: fromEstadoDeCuenta.State;
}

export const reducers: ActionReducerMap<State> = {
  envioComisiones: fromEnvioComision.reducer,
  prestamos: fromPrestamos.reducer,
  facturistas: fromFacturistas.reducer,
  cargos: fromCargos.reducer,
  estadoDeCuenta: fromEstadoDeCuenta.reducer
};

export const getState = createFeatureSelector<State>('embarques');
