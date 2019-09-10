import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  AnalisisDeNotaActionTypes,
  AnalisisDeNotaActions
} from '../actions/analisis-de-nota.actions';

import * as _ from 'lodash';
import { AnalisisDeNota } from 'app/cxp/model';

export interface State extends EntityState<AnalisisDeNota> {
  loading: boolean;
}

export const adapter: EntityAdapter<AnalisisDeNota> = createEntityAdapter<
  AnalisisDeNota
>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: AnalisisDeNotaActions
): State {
  switch (action.type) {
    case AnalisisDeNotaActionTypes.LoadAnalisisDeNota:
    case AnalisisDeNotaActionTypes.CreateAnalisisDeNota:
    case AnalisisDeNotaActionTypes.DeleteAnalisisDeNota:
    case AnalisisDeNotaActionTypes.UpdateAnalisisDeNota: {
      return {
        ...state,
        loading: true
      };
    }

    case AnalisisDeNotaActionTypes.LoadAnalisisDeNotaFail:
    case AnalisisDeNotaActionTypes.CreateAnalisisDeNotaFail:
    case AnalisisDeNotaActionTypes.DeleteAnalisisDeNotaFail:
    case AnalisisDeNotaActionTypes.UpdateAnalisisDeNotaFail: {
      return {
        ...state,
        loading: false
      };
    }
    case AnalisisDeNotaActionTypes.LoadAnalisisDeNotaSuccess: {
      return adapter.addAll(action.payload.analisis, {
        ...state,
        loading: false
      });
    }

    case AnalisisDeNotaActionTypes.UpdateAnalisisDeNotaSuccess: {
      return adapter.upsertOne(action.payload.analisis, {
        ...state,
        loading: false
      });
    }

    case AnalisisDeNotaActionTypes.CreateAnalisisDeNotaSuccess: {
      return adapter.addOne(action.payload.analisis, {
        ...state,
        loading: false
      });
    }
    case AnalisisDeNotaActionTypes.DeleteAnalisisDeNotaSuccess: {
      return adapter.removeOne(action.payload.analisisId, {
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
