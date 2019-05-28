import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { NotaDeCredito } from 'app/cobranza/models';

import {
  BonificacionActions,
  BonificacionActionTypes
} from '../actions/bonificacion.actions';

export interface State extends EntityState<NotaDeCredito> {
  loading: boolean;
}

export const adapter: EntityAdapter<NotaDeCredito> = createEntityAdapter<
  NotaDeCredito
>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: BonificacionActions
): State {
  switch (action.type) {
    case BonificacionActionTypes.DeleteBonificacion:
    case BonificacionActionTypes.UpdateBonificacion:
    case BonificacionActionTypes.CreateBonificacion: {
      return {
        ...state,
        loading: true
      };
    }

    case BonificacionActionTypes.DeleteBonificacionFail:
    case BonificacionActionTypes.UpdateBonificacionFail:
    case BonificacionActionTypes.CreateBonificacionFail: {
      return {
        ...state,
        loading: false
      };
    }

    case BonificacionActionTypes.LoadBonificacionesSuccess: {
      return adapter.addAll(action.payload.bonificaciones, {
        ...state,
        loading: false
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
