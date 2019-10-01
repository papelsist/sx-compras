import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  AnalisisTrsDetActionTypes,
  AnalisisTrsDetActions
} from '../actions/analisis-de-transformacion-det.actions';

import * as _ from 'lodash';
import { AnalisisDeTransformacionDet } from 'app/cxp/model';

export interface State extends EntityState<AnalisisDeTransformacionDet> {
  loading: boolean;
}

export const adapter: EntityAdapter<
  AnalisisDeTransformacionDet
> = createEntityAdapter<AnalisisDeTransformacionDet>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: AnalisisTrsDetActions
): State {
  switch (action.type) {
    case AnalisisTrsDetActionTypes.LoadAnalisisTrsDet:
    case AnalisisTrsDetActionTypes.AddAnalisisTrsDet:
    case AnalisisTrsDetActionTypes.RemoveAnalisisTrsDet:
    case AnalisisTrsDetActionTypes.UpdateAnalisisTrsDet: {
      return {
        ...state,
        loading: true
      };
    }

    case AnalisisTrsDetActionTypes.LoadAnalisisTrsDetFail:
    case AnalisisTrsDetActionTypes.AddAnalisisTrsDetFail:
    case AnalisisTrsDetActionTypes.RemoveAnalisisTrsDetFail:
    case AnalisisTrsDetActionTypes.UpdateAnalisisTrsDetFail: {
      return {
        ...state,
        loading: false
      };
    }
    case AnalisisTrsDetActionTypes.LoadAnalisisTrsDetSuccess: {
      return adapter.addAll(action.payload.partidas, {
        ...state,
        loading: false
      });
    }

    case AnalisisTrsDetActionTypes.UpdateAnalisisTrsDetSuccess: {
      return adapter.upsertOne(action.payload.det, {
        ...state,
        loading: false
      });
    }

    case AnalisisTrsDetActionTypes.AddAnalisisTrsDetSuccess: {
      return adapter.addOne(action.payload.det, {
        ...state,
        loading: false
      });
    }
    case AnalisisTrsDetActionTypes.RemoveAnalisisTrsDetSuccess: {
      return adapter.removeOne(action.payload.id, {
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

export const getLoading = (state: State) => state.loading;
