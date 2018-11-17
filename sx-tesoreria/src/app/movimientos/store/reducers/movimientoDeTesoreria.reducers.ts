import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { MovimientoDeTesoreria } from '../../models';

import {
  MovimientoActions,
  MovimientoActionTypes
} from '../actions/movimientoDeTesoreria.actions';

import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<MovimientoDeTesoreria> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export const adapter: EntityAdapter<
  MovimientoDeTesoreria
> = createEntityAdapter<MovimientoDeTesoreria>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(30),
  term: ''
});

export function reducer(
  state = initialState,
  action: MovimientoActions
): State {
  switch (action.type) {
    case MovimientoActionTypes.SetMovimientosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case MovimientoActionTypes.DeleteMovimiento:
    case MovimientoActionTypes.UpdateMovimiento:
    case MovimientoActionTypes.CreateMovimiento:
    case MovimientoActionTypes.LoadMovimientos: {
      return {
        ...state,
        loading: true
      };
    }

    case MovimientoActionTypes.MovimientoError: {
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

    case MovimientoActionTypes.UpdateMovimientoSuccess:
    case MovimientoActionTypes.CreateMovimientoSuccess: {
      const movimiento = action.payload.movimiento;
      return adapter.upsertOne(movimiento, {
        ...state,
        loading: false
      });
    }

    case MovimientoActionTypes.DeleteMovimientoSuccess: {
      return adapter.removeOne(action.payload.movimiento.id, {
        ...state,
        loading: false
      });
    }

    case MovimientoActionTypes.UpsertMovimiento: {
      return adapter.upsertOne(action.payload.movimiento, {
        ...state,
        loading: false
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
export const getMovimientosFilter = (state: State) => state.filter;
export const getMovimientosSearchTerm = (state: State) => state.term;
