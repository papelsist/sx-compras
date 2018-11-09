import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTraspasos from './traspaso.reducers';
import * as fromInversiones from './inversion.reducers';
import * as fromMovimientos from './movimientoDeTesoreria.reducers';

export interface State {
  traspasos: fromTraspasos.State;
  inversiones: fromInversiones.State;
  movimientos: fromMovimientos.State;
}

export const reducers: ActionReducerMap<State> = {
  traspasos: fromTraspasos.reducer,
  inversiones: fromInversiones.reducer,
  movimientos: fromMovimientos.reducer
};

export const getState = createFeatureSelector<State>('movimientos');
