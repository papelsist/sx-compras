import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { SaldoPorCuenta } from '../../models/saldoPorCuenta';
import { SaldoActions, SaldoActionTypes } from '../actions/saldos.actions';

export interface State extends EntityState<SaldoPorCuenta> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<SaldoPorCuenta> = createEntityAdapter<
  SaldoPorCuenta
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(state = initialState, action: SaldoActions): State {
  switch (action.type) {
    case SaldoActionTypes.LoadSaldos: {
      return {
        ...state,
        loading: true
      };
    }
    case SaldoActionTypes.LoadSaldosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case SaldoActionTypes.LoadSaldosSuccess: {
      return adapter.addAll(action.payload.saldos, {
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

export const getSaldosLoading = (state: State) => state.loading;
export const getSaldosLoaded = (state: State) => state.loaded;
