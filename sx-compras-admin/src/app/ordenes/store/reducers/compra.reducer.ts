import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Compra, ComprasFilter, buildComprasFilter } from '../../models/compra';
import { CompraActions, CompraActionTypes } from '../actions/compra.actions';

export interface State extends EntityState<Compra> {
  loading: boolean;
  loaded: boolean;
  searchTerm: string;
  filter: ComprasFilter;
  selected: string[];
}

export const adapter: EntityAdapter<Compra> = createEntityAdapter<Compra>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  searchTerm: '',
  filter: buildComprasFilter(45),
  selected: []
});

export function reducer(state = initialState, action: CompraActions): State {
  switch (action.type) {
    case CompraActionTypes.SetComprasSearchTerm: {
      const searchTerm = action.payload.term;
      return {
        ...state,
        searchTerm
      };
    }
    case CompraActionTypes.SetComprasFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }

    case CompraActionTypes.ActualizarPrecios:
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

    case CompraActionTypes.ActualizarPreciosFail:
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

    case CompraActionTypes.ActualizarPreciosSuccess:
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
export const getComprasFilter = (state: State) => state.filter;
export const getComprasSearchTerm = (state: State) => state.searchTerm;
