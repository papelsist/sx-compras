import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  EstadoDeCuentaActionTypes,
  EstadoDeCuentaActions
} from '../actions/estado-cuenta.actions';
import {
  FacturistaDeEmbarque,
  FacturistaEstadoDeCuenta
} from 'app/control-de-embarques/model';

export interface State extends EntityState<FacturistaEstadoDeCuenta> {
  facturista: FacturistaDeEmbarque;
  loading: boolean;
}

export const adapter: EntityAdapter<
  FacturistaEstadoDeCuenta
> = createEntityAdapter<FacturistaEstadoDeCuenta>();

export const initialState: State = adapter.getInitialState({
  facturista: undefined,
  loading: false
});

export function reducer(
  state: State = initialState,
  action: EstadoDeCuentaActions
): State {
  switch (action.type) {
    case EstadoDeCuentaActionTypes.SetFacturista: {
      const facturista = action.payload.facturista;
      return {
        ...state,
        facturista
      };
    }

    case EstadoDeCuentaActionTypes.GenerarNotaDeCargo:
    case EstadoDeCuentaActionTypes.GenerarIntereses:
    case EstadoDeCuentaActionTypes.LoadEstadoDeCuenta: {
      return {
        ...state,
        loading: true
      };
    }

    case EstadoDeCuentaActionTypes.GenerarInteresesFail:
    case EstadoDeCuentaActionTypes.GenerarInteresesFail:
    case EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail: {
      return {
        ...state,
        loading: false
      };
    }

    case EstadoDeCuentaActionTypes.LoadEstadoDeCuentaSuccess: {
      return adapter.addAll(action.payload.rows, {
        ...state,
        loading: false
      });
    }

    case EstadoDeCuentaActionTypes.GenerarNotaDeCargoSuccess:
    case EstadoDeCuentaActionTypes.GenerarInteresesSuccess: {
      return {
        ...state,
        loading: false
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const selectedFacturista = (state: State) => state.facturista;
export const selectLoading = (state: State) => state.loading;
