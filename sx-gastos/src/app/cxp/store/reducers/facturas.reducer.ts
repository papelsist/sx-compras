import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CuentaPorPagar, CxPFilter, createCxPFilter } from '../../model';
import {
  FacturaActions,
  FacturaActionTypes
} from '../actions/facturas.actions';

import { Periodo } from 'app/_core/models/periodo';

export const FACTURAS_DE_GASTO_PERIODO_KEY = 'sx.gastos.facturas.periodo';

export interface State extends EntityState<CuentaPorPagar> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
  filter: CxPFilter;
}

export const adapter: EntityAdapter<CuentaPorPagar> = createEntityAdapter<
  CuentaPorPagar
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromNow(30),
  filter: createCxPFilter()
});

export function reducer(state = initialState, action: FacturaActions): State {
  switch (action.type) {
    case FacturaActionTypes.SetFacturasPeriodo: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }
    case FacturaActionTypes.SetFacturasFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
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
export const getPeriodo = (state: State) => state.periodo;
export const getFacturasFilter = (state: State) => state.filter;
