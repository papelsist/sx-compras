import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { PrestamoChofer, readFromLocalStorage } from '../../model';
import {
  PrestamoChoferActions,
  PrestamoChoferActionTypes
} from '../actions/prestamo-chofer.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<PrestamoChofer> {
  loading: boolean;
  loaded: boolean;
  filter: { periodo: Periodo; registros: number };
  term: string;
}

export const adapter: EntityAdapter<PrestamoChofer> = createEntityAdapter<
  PrestamoChofer
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: { periodo: Periodo.fromNow(120), registros: 100 },
  term: ''
});

export function reducer(
  state = initialState,
  action: PrestamoChoferActions
): State {
  switch (action.type) {
    case PrestamoChoferActionTypes.SetPrestamoChoferFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case PrestamoChoferActionTypes.SetPrestamoChoferSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case PrestamoChoferActionTypes.LoadPrestamosChofer: {
      return {
        ...state,
        loading: true
      };
    }

    case PrestamoChoferActionTypes.LoadPrestamosChoferFail: {
      return {
        ...state,
        loading: false
      };
    }

    case PrestamoChoferActionTypes.LoadPrestamosChoferSuccess: {
      return adapter.addAll(action.payload.prestamos, {
        ...state,
        loading: false,
        loaded: true
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

export const getPrestamosChoferLoading = (state: State) => state.loading;
export const getPrestamosChoferLoaded = (state: State) => state.loaded;
export const getPrestamosChoferFilter = (state: State) => state.filter;
export const getPrestamosChoferSearchTerm = (state: State) => state.term;
