import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEnvioComision from './envio-comision.reducers';

export interface State {
  envioComisiones: fromEnvioComision.State;
}

export const reducers: ActionReducerMap<State> = {
  envioComisiones: fromEnvioComision.reducer
};

export const getState = createFeatureSelector<State>('embarques');
