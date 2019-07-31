import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { Periodo } from 'app/_core/models/periodo';
import { ListaDePreciosVenta } from '../models';

import { ListaActionTypes, ListaDePreciosActions } from './actions';

export const LISTA_DE_PRECIOSV_PERIODO_KEY = 'sx.compras.requisiciones.periodo';

export const FEATURE_STORE_NAME = 'lista-de-precios-venta';

export interface State extends EntityState<ListaDePreciosVenta> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<ListaDePreciosVenta> = createEntityAdapter<
  ListaDePreciosVenta
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(
    LISTA_DE_PRECIOSV_PERIODO_KEY,
    Periodo.fromNow(180)
  )
});

export function reducer(
  state = initialState,
  action: ListaDePreciosActions
): State {
  switch (action.type) {
    case ListaActionTypes.AplicarListaDePrecios:
    case ListaActionTypes.DeleteLista:
    case ListaActionTypes.UpdateLista:
    case ListaActionTypes.CreateLista:
    case ListaActionTypes.LoadListaDePrecios: {
      return {
        ...state,
        loading: true
      };
    }

    case ListaActionTypes.AplicarListaDePreciosFail:
    case ListaActionTypes.DeleteListaFail:
    case ListaActionTypes.UpdateListaFail:
    case ListaActionTypes.CreateListaFail:
    case ListaActionTypes.LoadListaDePreciosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ListaActionTypes.LoadListaDePreciosSuccess: {
      return adapter.addAll(action.payload.listas, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ListaActionTypes.CreateListaSuccess: {
      return adapter.addOne(action.payload.lista, {
        ...state,
        loading: false
      });
    }

    case ListaActionTypes.AplicarListaDePreciosSuccess:
    case ListaActionTypes.UpdateListaSuccess: {
      return adapter.upsertOne(action.payload.lista, {
        ...state,
        loading: false
      });
    }

    case ListaActionTypes.UpsertLista: {
      return adapter.upsertOne(action.payload.lista, {
        ...state
      });
    }

    case ListaActionTypes.DeleteListaSuccess: {
      return adapter.removeOne(action.payload.lista.id, {
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

export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;

export const getListaDePreciosState = createFeatureSelector<State>(
  FEATURE_STORE_NAME
);
