import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CompraActionTypes } from './actions';
import * as fromActions from './actions';

import { OrdenDeCompra } from '../models';
import { Periodo } from 'app/_core/models/periodo';

export const ComprasPeriodoStoeKey = 'sx-compras.compras.periodo';

export interface State extends EntityState<OrdenDeCompra> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<OrdenDeCompra> = createEntityAdapter<
  OrdenDeCompra
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(ComprasPeriodoStoeKey)
});

export function reducer(
  state = initialState,
  action: fromActions.CompraActions
): State {
  switch (action.type) {
    case CompraActionTypes.SetPeriodo: {
      const periodo = action.payload.periodo;
      return {
        ...state,
        periodo
      };
    }

    case CompraActionTypes.LoadCompras: {
      return {
        ...state,
        loading: true
      };
    }
    case CompraActionTypes.LoadComprasFail: {
      return {
        ...state,
        loading: false
      };
    }
    case CompraActionTypes.LoadComprasSuccess: {
      return adapter.addAll(action.payload, {
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

// export const getLoading = (state: State) => state.loading;
// export const getComprasLoaded = (state: State) => state.loaded;
// export const getPeriodo = (state: State) => state.periodo;
