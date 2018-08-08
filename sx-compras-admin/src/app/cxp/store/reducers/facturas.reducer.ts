import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CuentaPorPagar } from '../../model';
import {
  FacturaActions,
  FacturaActionTypes
} from '../actions/facturas.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<CuentaPorPagar> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<CuentaPorPagar> = createEntityAdapter<
  CuentaPorPagar
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage('sx-compras.cxp.facturas.periodo')
});

export function reducer(state = initialState, action: FacturaActions): State {
  switch (action.type) {
    case FacturaActionTypes.SetFacturasPeriodo: {
      const periodo = action.payload;
      return {
        ...state,
        periodo
      };
    }

    case FacturaActionTypes.LoadFacturas: {
      return {
        ...state,
        loading: true
      };
    }

    case FacturaActionTypes.UpdateFacturaFail:
    case FacturaActionTypes.LoadFacturasFail: {
      return {
        ...state,
        loading: false
      };
    }
    case FacturaActionTypes.LoadFacturasSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case FacturaActionTypes.UpdateFacturaSuccess: {
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

    case FacturaActionTypes.UpsertFactura: {
      return adapter.upsertOne(action.payload.factura, {
        ...state,
        loading: false
      });
    }

    case FacturaActionTypes.ClearFacturas: {
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

export const getFacturasLoading = (state: State) => state.loading;
export const getFacturasLoaded = (state: State) => state.loaded;
export const getFacturasPeriodo = (state: State) => state.periodo;
