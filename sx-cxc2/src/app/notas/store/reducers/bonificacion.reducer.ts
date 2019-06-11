import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Bonificacion } from 'app/cobranza/models';

import {
  BonificacionActions,
  BonificacionActionTypes
} from '../actions/bonificacion.actions';

export interface State extends EntityState<Bonificacion> {
  loading: boolean;
  loaded: boolean;
}

function sortBySeqFolio(e1: Bonificacion, e2: Bonificacion) {
  return e2.folio - e1.folio;
}

export const adapter: EntityAdapter<Bonificacion> = createEntityAdapter<
  Bonificacion
>({
  sortComparer: sortBySeqFolio
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: BonificacionActions
): State {
  switch (action.type) {
    case BonificacionActionTypes.AplicarBonificacion:
    case BonificacionActionTypes.GenerarBonificacionCfdi:
    case BonificacionActionTypes.DeleteBonificacion:
    case BonificacionActionTypes.UpdateBonificacion:
    case BonificacionActionTypes.CreateBonificacion:
    case BonificacionActionTypes.LoadBonificaciones: {
      return {
        ...state,
        loading: true
      };
    }

    case BonificacionActionTypes.DeleteBonificacionFail:
    case BonificacionActionTypes.UpdateBonificacionFail:
    case BonificacionActionTypes.CreateBonificacionFail:
    case BonificacionActionTypes.LoadBonificacionesFail: {
      return {
        ...state,
        loading: false
      };
    }

    case BonificacionActionTypes.LoadBonificacionesSuccess: {
      return adapter.addAll(action.payload.bonificaciones, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case BonificacionActionTypes.CreateBonificacionSuccess: {
      const bonificacion = action.payload.bonificacion;
      return adapter.addOne(bonificacion, {
        ...state,
        loading: false
      });
    }

    case BonificacionActionTypes.UpdateBonificacionSuccess: {
      const bonificacion = action.payload.bonificacion;
      return adapter.upsertOne(bonificacion, {
        ...state,
        loading: false
      });
    }

    case BonificacionActionTypes.DeleteBonificacionSuccess: {
      const bonificacion = action.payload.bonificacion;
      return adapter.removeOne(bonificacion.id, {
        ...state,
        loading: false
      });
    }

    case BonificacionActionTypes.UpsertBonificacion: {
      const bonificacion = action.payload.bonificacion;
      return adapter.upsertOne(bonificacion, {
        ...state
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

export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
