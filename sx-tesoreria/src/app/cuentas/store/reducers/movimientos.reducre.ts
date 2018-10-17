import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Movimiento } from '../../models/movimiento';
import {
  MovimientoActions,
  MovimientoActionTypes
} from '../actions/movimientos.actions';

import * as moment from 'moment';

export interface State extends EntityState<Movimiento> {
  loading: boolean;
  loaded: boolean;
}

export function sortMovimientos(ob1: Movimiento, ob2: Movimiento): number {
  const d1 = moment(ob1.lastUpdated);
  const d2 = moment(ob2.lastUpdated);
  return d1.isSameOrBefore(d2) ? 1 : -1;
}

export const adapter: EntityAdapter<Movimiento> = createEntityAdapter<
  Movimiento
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: MovimientoActions
): State {
  switch (action.type) {
    case MovimientoActionTypes.LoadMovimientos: {
      return {
        ...state,
        loading: true
      };
    }
    case MovimientoActionTypes.LoadMovimientosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case MovimientoActionTypes.LoadMovimientosSuccess: {
      return adapter.addAll(action.payload.movimientos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getMovimientosLoading = (state: State) => state.loading;
export const getMovimientosLoaded = (state: State) => state.loaded;
