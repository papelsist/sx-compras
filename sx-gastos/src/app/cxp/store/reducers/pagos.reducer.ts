import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Pago, PagosFilter, createPagoFilter } from '../../model';
import { PagoActions, PagoActionTypes } from '../actions/pagos.actions';

export interface State extends EntityState<Pago> {
  loading: boolean;
  loaded: boolean;
  filter: PagosFilter;
  term: string;
}

export const adapter: EntityAdapter<Pago> = createEntityAdapter<Pago>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPagoFilter(),
  term: ''
});

export function reducer(state = initialState, action: PagoActions): State {
  switch (action.type) {
    case PagoActionTypes.SetPagosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case PagoActionTypes.SetPagosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case PagoActionTypes.AplicarPago:
    case PagoActionTypes.DeletePago:
    case PagoActionTypes.LoadPagos: {
      return {
        ...state,
        loading: true
      };
    }

    case PagoActionTypes.DeletePagoFail:
    case PagoActionTypes.UpdatePagoFail:
    case PagoActionTypes.LoadPagosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case PagoActionTypes.LoadPagosSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case PagoActionTypes.UpdatePagoSuccess: {
      const pago = action.payload;
      return adapter.updateOne(
        {
          id: pago.id,
          changes: pago
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case PagoActionTypes.UpsertPago: {
      return adapter.upsertOne(action.payload.pago, {
        ...state,
        loading: false
      });
    }
    case PagoActionTypes.UpsertPagos: {
      return adapter.upsertMany(action.payload, {
        ...state,
        loading: false
      });
    }

    case PagoActionTypes.DeletePagoSuccess: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    }

    case PagoActionTypes.ClearPagos: {
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

export const getPagosLoading = (state: State) => state.loading;
export const getPagosLoaded = (state: State) => state.loaded;
export const getPagosFilter = (state: State) => state.filter;
export const getPagosSearchTerm = (state: State) => state.term;
