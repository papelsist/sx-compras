import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  AnalisisDeTrsActionTypes,
  AnalisisDeTrsActions
} from '../actions/analisis-de-transformacion.actions';

import * as _ from 'lodash';
import { AnalisisDeTransformacion } from 'app/cxp/model';

export interface State extends EntityState<AnalisisDeTransformacion> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<
  AnalisisDeTransformacion
> = createEntityAdapter<AnalisisDeTransformacion>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: AnalisisDeTrsActions
): State {
  switch (action.type) {
    case AnalisisDeTrsActionTypes.LoadAnalisisDeTransformaciones: {
      return {
        ...state,
        loading: true,
        loaded: true
      };
    }
    case AnalisisDeTrsActionTypes.LoadAnalisisDeTransformaciones:
    case AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacion:
    case AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacion:
    case AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacion: {
      return {
        ...state,
        loading: true
      };
    }

    case AnalisisDeTrsActionTypes.LoadAnalisisDeTransformacionesFail:
    case AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionFail:
    case AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionFail:
    case AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacionFail: {
      return {
        ...state,
        loading: false
      };
    }
    case AnalisisDeTrsActionTypes.LoadAnalisisDeTransformacionesSuccess: {
      return adapter.addAll(action.payload.rows, {
        ...state,
        loading: false
      });
    }

    case AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacionSuccess: {
      return adapter.upsertOne(action.payload.analisis, {
        ...state,
        loading: false
      });
    }

    case AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionSuccess: {
      return adapter.addOne(action.payload.analisis, {
        ...state,
        loading: false
      });
    }
    case AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionSuccess: {
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
export const getLoaded = (state: State) => state.loaded;
