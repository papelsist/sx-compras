import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  SolicitudActions,
  SolicitudActionTypes
} from '../actions/solicitud.actions';
import { SolicitudDeDeposito, CarteraFilter, Cartera } from '../../models';

export interface State extends EntityState<SolicitudDeDeposito> {
  loading: boolean;
  loaded: boolean;
  filter: CarteraFilter;
  term: string;
  cartera: Cartera;
}

export const adapter: EntityAdapter<SolicitudDeDeposito> = createEntityAdapter<
  SolicitudDeDeposito
>({});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  filter: undefined,
  term: '',
  cartera: undefined
});

export function reducer(state = initialState, action: SolicitudActions): State {
  switch (action.type) {
    case SolicitudActionTypes.SetSolicitudesCartera: {
      const cartera = action.payload.cartera;
      return {
        ...state,
        cartera
      };
    }
    case SolicitudActionTypes.SetSolicitudesFilter: {
      const filter = action.payload.filter;
      return {
        ...state,
        filter
      };
    }
    case SolicitudActionTypes.SetSolicitudesSearchTerm: {
      const term = action.payload.term;
      return {
        ...state,
        term
      };
    }

    case SolicitudActionTypes.UpdateSolicitud:
    case SolicitudActionTypes.CreateSolicitud:
    case SolicitudActionTypes.LoadSolicitudes: {
      return {
        ...state,
        loading: true
      };
    }

    case SolicitudActionTypes.UpdateSolicitudFail:
    case SolicitudActionTypes.CreateSolicitudFail:
    case SolicitudActionTypes.LoadSolicitudesFail: {
      return {
        ...state,
        loading: false
      };
    }

    case SolicitudActionTypes.LoadSolicitudesSuccess: {
      return adapter.addAll(action.payload.solicitudes, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case SolicitudActionTypes.CreateSolicitudSuccess: {
      const sol = action.payload.solicitud;
      return adapter.addOne(sol, {
        ...state,
        loading: false
      });
    }

    case SolicitudActionTypes.UpdateSolicitudSuccess: {
      const sol = action.payload.solicitud;
      return adapter.upsertOne(sol, {
        ...state,
        loading: false
      });
    }

    default:
      return state;
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const getCartera = (state: State) => state.cartera;
export const getSolicitudesLoading = (state: State) => state.loading;
export const getSolicitudesLoaded = (state: State) => state.loaded;
export const getSolicitudesFilter = (state: State) => state.filter;
export const getSolicitudesSearchTerm = (state: State) => state.term;
