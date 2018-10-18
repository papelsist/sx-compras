import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CuentaDeBanco } from 'app/models';
import { CuentaActions, CuentaActionTypes } from '../actions/cuentas.actions';

import * as moment from 'moment';
import { EjercicioMes, buildCurrentPeriodo } from 'app/models/ejercicioMes';

export interface State extends EntityState<CuentaDeBanco> {
  loading: boolean;
  loaded: boolean;
  periodo: EjercicioMes;
  selectedId: string;
}

export function sortByNumero(ob1: CuentaDeBanco, ob2: CuentaDeBanco): number {
  const d1 = moment(ob1.lastUpdated);
  const d2 = moment(ob2.lastUpdated);
  return d1.isSameOrBefore(d2) ? 1 : -1;
}

export const adapter: EntityAdapter<CuentaDeBanco> = createEntityAdapter<
  CuentaDeBanco
>({
  sortComparer: sortByNumero
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: buildCurrentPeriodo(),
  selectedId: undefined
});

export function reducer(state = initialState, action: CuentaActions): State {
  switch (action.type) {
    case CuentaActionTypes.AddCuenta:
    case CuentaActionTypes.UpdateCuenta:
    case CuentaActionTypes.LoadCuentas: {
      return {
        ...state,
        loading: true
      };
    }

    case CuentaActionTypes.AddCuentaFail:
    case CuentaActionTypes.UpdateCuentaFail:
    case CuentaActionTypes.LoadCuentasFail: {
      return {
        ...state,
        loading: false
      };
    }

    case CuentaActionTypes.LoadCuentasSuccess: {
      return adapter.addAll(action.payload.cuentas, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case CuentaActionTypes.AddCuentaSuccess: {
      const cuenta = action.payload.cuenta;
      return adapter.addOne(cuenta, {
        ...state,
        loading: false
      });
    }

    case CuentaActionTypes.UpdateCuentaSuccess: {
      const cheque = action.payload.cuenta;
      return adapter.updateOne(
        {
          id: cheque.id,
          changes: cheque
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case CuentaActionTypes.UpsertCuenta: {
      return adapter.upsertOne(action.payload.cuenta, {
        ...state,
        loading: false
      });
    }
    case CuentaActionTypes.SetPeriodoDeAnalisis: {
      return {
        ...state,
        periodo: action.payload.periodo
      };
    }
    case CuentaActionTypes.SetSelectedCuenta: {
      return {
        ...state,
        selectedId: action.payload.cuenta.id
      };
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

export const getCuentasLoading = (state: State) => state.loading;
export const getCuentasLoaded = (state: State) => state.loaded;
export const getPeriodo = (state: State) => state.periodo;
export const getSelectedCuentaId = (state: State) => state.selectedId;
