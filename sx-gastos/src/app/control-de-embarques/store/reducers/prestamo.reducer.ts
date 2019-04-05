import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { FacturistaPrestamo } from '../../model';
import {
  PrestamosActions,
  PrestamosActionTypes
} from '../actions/prestamo.actions';
import { Periodo } from 'app/_core/models/periodo';

export interface State extends EntityState<FacturistaPrestamo> {
  loading: boolean;
  loaded: boolean;
  filter: { periodo: Periodo };
  term: string;
}

export const adapter: EntityAdapter<FacturistaPrestamo> = createEntityAdapter<
  FacturistaPrestamo
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: { periodo: Periodo.fromNow(200) },
  term: ''
});

export function reducer(state = initialState, action: PrestamosActions): State {
  switch (action.type) {
    case PrestamosActionTypes.SetPrestamosFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case PrestamosActionTypes.SetPrestamosSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case PrestamosActionTypes.DeletePrestamo:
    case PrestamosActionTypes.UpdatePrestamo:
    case PrestamosActionTypes.CreatePrestamo:
    case PrestamosActionTypes.LoadPrestamos: {
      return {
        ...state,
        loading: true
      };
    }

    case PrestamosActionTypes.DeletePrestamoFail:
    case PrestamosActionTypes.UpdatePrestamoFail:
    case PrestamosActionTypes.CreatePrestamoFail:
    case PrestamosActionTypes.LoadPrestamosFail: {
      return {
        ...state,
        loading: false
      };
    }

    case PrestamosActionTypes.LoadPrestamosSuccess: {
      return adapter.addAll(action.payload.prestamos, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case PrestamosActionTypes.UpdatePrestamoSuccess:
    case PrestamosActionTypes.CreatePrestamoSuccess: {
      return adapter.upsertOne(action.payload.prestamo, {
        ...state,
        loading: false
      });
    }

    case PrestamosActionTypes.DeletePrestamoSuccess: {
      return adapter.removeOne(action.payload.prestamo.id, {
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

export const getPrestamosLoading = (state: State) => state.loading;
export const getPrestamosLoaded = (state: State) => state.loaded;
export const getPrestamosFilter = (state: State) => state.filter;
export const getPrestamosSearchTerm = (state: State) => state.term;
