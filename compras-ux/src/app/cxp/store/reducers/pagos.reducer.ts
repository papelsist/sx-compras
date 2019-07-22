import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Pago } from '../../model';
import { PagoActions, PagoActionTypes } from '../actions/pagos.actions';
import { Periodo } from 'app/_core/models/periodo';

export const PagosPeriodoStoeKey = 'sx-compras.cxp.pagos.periodo';

export interface State extends EntityState<Pago> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<Pago> = createEntityAdapter<Pago>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(PagosPeriodoStoeKey)
});

export function reducer(state = initialState, action: PagoActions): State {
  switch (action.type) {
    case PagoActionTypes.SetPeriodoDePagos: {
      return {
        ...state,
        periodo: action.payload.periodo
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
export const getPeriodo = (state: State) => state.periodo;
