import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CuentaDeBanco } from 'app/models';
import { CuentaActions, CuentaActionTypes } from '../actions/cuentas.actions';

import * as moment from 'moment';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<CuentaDeBanco> {
  loading: boolean;
  loaded: boolean;
  periodo: { ejercicio: number; mes: number };
}

export function sortByNumero(ob1: CuentaDeBanco, ob2: CuentaDeBanco): number {
  const d1 = moment(ob1.lastUpdated);
  const d2 = moment(ob2.lastUpdated);
  // return ob1.lastUpdated.localeCompare(ob2.numero);
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
  periodo: { ejercicio: moment().year(), mes: moment().month() + 1 }
});

export function reducer(state = initialState, action: CuentaActions): State {
  switch (action.type) {
    case CuentaActionTypes.LoadCuentas: {
      return {
        ...state,
        loading: true
      };
    }

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
