import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTraspasos from './traspaso.reducers';
import * as fromInversiones from './inversion.reducers';
import * as fromMovimientos from './movimientoDeTesoreria.reducers';
import * as fromComisiones from './comision.reducer';

export interface State {
  traspasos: fromTraspasos.State;
  inversiones: fromInversiones.State;
  movimientos: fromMovimientos.State;
  comisiones: fromComisiones.State;
}

export const reducers: ActionReducerMap<State> = {
  traspasos: fromTraspasos.reducer,
  inversiones: fromInversiones.reducer,
  movimientos: fromMovimientos.reducer,
  comisiones: fromComisiones.reducer
};

export const getState = createFeatureSelector<State>('movimientos');
