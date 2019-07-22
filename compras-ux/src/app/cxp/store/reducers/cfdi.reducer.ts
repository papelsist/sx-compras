import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ComprobanteFiscal } from '../../model';
import {
  ComprobanteActions,
  ComprobanteActionTypes
} from '../actions/cfdi.actions';

export interface State extends EntityState<ComprobanteFiscal> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<ComprobanteFiscal> = createEntityAdapter<
  ComprobanteFiscal
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: ComprobanteActions
): State {
  switch (action.type) {
    case ComprobanteActionTypes.LoadComprobantes: {
      return {
        ...state,
        loading: true
      };
    }

    case ComprobanteActionTypes.UpdateComprobanteFail:
    case ComprobanteActionTypes.LoadComprobantesFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ComprobanteActionTypes.LoadComprobantesSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ComprobanteActionTypes.UpdateComprobanteSuccess: {
      const cfdi = action.payload;
      return adapter.updateOne(
        {
          id: cfdi.id,
          changes: cfdi
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case ComprobanteActionTypes.UpsertComprobante: {
      return adapter.upsertOne(action.payload.comprobante, {
        ...state,
        loading: false
      });
    }

    case ComprobanteActionTypes.ClearComprobantes: {
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

export const getComprobantesLoading = (state: State) => state.loading;
export const getComprobantesLoaded = (state: State) => state.loaded;
