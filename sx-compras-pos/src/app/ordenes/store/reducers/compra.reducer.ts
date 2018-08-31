import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Compra } from '../../models/compra';
import { CompraActions, CompraActionTypes } from '../actions/compra.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<Compra> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
  searchTerm: string;
}

export const adapter: EntityAdapter<Compra> = createEntityAdapter<Compra>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromNow(30),
  searchTerm: undefined
});

export function reducer(state = initialState, action: CompraActions): State {
  switch (action.type) {
    case CompraActionTypes.SetPeriodo: {
      const periodo = action.payload;
      return {
        ...state,
        periodo
      };
    }
    case CompraActionTypes.SetSearchTerm: {
      const searchTerm = action.payload;
      return {
        ...state,
        searchTerm
      };
    }

    case CompraActionTypes.DepurarCompra:
    case CompraActionTypes.CerrarCompra:
    case CompraActionTypes.DeleteCompra:
    case CompraActionTypes.AddCompra:
    case CompraActionTypes.LoadCompras: {
      return {
        ...state,
        loading: true
      };
    }

    case CompraActionTypes.DeleteCompraFail:
    case CompraActionTypes.UpdateCompraFail:
    case CompraActionTypes.AddCompraFail:
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

    case CompraActionTypes.AddCompraSuccess: {
      return adapter.addOne(action.payload, {
        ...state,
        loading: false
      });
    }

    case CompraActionTypes.UpdateCompraSuccess: {
      const compra = action.payload;
      return adapter.updateOne(
        {
          id: compra.id,
          changes: compra
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case CompraActionTypes.UpsertCompra: {
      return adapter.upsertOne(action.payload.compra, {
        ...state,
        loading: false
      });
    }
    case CompraActionTypes.UpsertCompras: {
      return adapter.upsertMany(action.payload, {
        ...state,
        loading: false
      });
    }

    case CompraActionTypes.DeleteCompraSuccess: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    }

    case CompraActionTypes.ClearCompras: {
      return adapter.removeAll(state);
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

export const getComprasLoading = (state: State) => state.loading;
export const getComprasLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;
export const getSearchTerm = (state: State) => state.searchTerm;
