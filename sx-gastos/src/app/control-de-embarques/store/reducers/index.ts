import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEnvioComision from './envio-comision.reducers';
import * as fromPrestamos from './prestamo-chofer.reducer';

export interface State {
  envioComisiones: fromEnvioComision.State;
  prestamos: fromPrestamos.State;
}

export const reducers: ActionReducerMap<State> = {
  envioComisiones: fromEnvioComision.reducer,
  prestamos: fromPrestamos.reducer
};

export const getState = createFeatureSelector<State>('embarques');
