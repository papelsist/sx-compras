import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ChequeDevuelto } from '../../models';
import {
  ChequeDevueltoActions,
  ChequeDevueltoActionTypes
} from '../actions/cheque-devuelto.actions';

import * as moment from 'moment';
import { PeriodoFilter, createPeriodoFilter } from 'app/models';

export interface State extends EntityState<ChequeDevuelto> {
  loading: boolean;
  loaded: boolean;
  filter: PeriodoFilter;
  term: string;
}

export function comparLastUpdate(
  row1: ChequeDevuelto,
  row2: ChequeDevuelto
): number {
  const d1 = moment(row1.modificado);
  const d2 = moment(row2.modificado);
  return d1.isSameOrBefore(d2) ? 1 : -1;
}

export const adapter: EntityAdapter<ChequeDevuelto> = createEntityAdapter<
  ChequeDevuelto
>({
  sortComparer: comparLastUpdate
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: createPeriodoFilter(),
  term: ''
});

export function reducer(
  state = initialState,
  action: ChequeDevueltoActions
): State {
  switch (action.type) {
    case ChequeDevueltoActionTypes.SetChequeDevueltosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case ChequeDevueltoActionTypes.SetChequeDevueltosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }
    case ChequeDevueltoActionTypes.DeleteChequeDevuelto:
    case ChequeDevueltoActionTypes.CreateChequeDevuelto:
    case ChequeDevueltoActionTypes.LoadChequeDevueltos: {
      return {
        ...state,
        loading: true
      };
    }

    case ChequeDevueltoActionTypes.ChequeDevueltosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ChequeDevueltoActionTypes.LoadChequeDevueltosSuccess: {
      return adapter.addAll(action.payload.cheques, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ChequeDevueltoActionTypes.CreateChequeDevueltoSuccess: {
      return adapter.addOne(action.payload.cheque, {
        ...state,
        loading: false
      });
    }

    case ChequeDevueltoActionTypes.DeleteChequeDevueltoSuccess: {
      return adapter.removeOne(action.payload.cheque.id, {
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

export const getChequeDevueltosLoading = (state: State) => state.loading;
export const getChequeDevueltosLoaded = (state: State) => state.loaded;
export const getChequeDevueltosFilter = (state: State) => state.filter;
export const getChequeDevueltosSearchTerm = (state: State) => state.term;
