import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  RecepcionesActions,
  RecepcionActionTypes
} from './recepciones.actions';
import { RecepcionDeCompra, ComsFilter, buildComsFilter } from '../models';
import { Periodo } from 'app/_core/models/periodo';

export const RecepcionesDeCompraPeriodoStoeKey =
  'sx-compras.requisiciones.periodo';

export interface State extends EntityState<RecepcionDeCompra> {
  loading: boolean;
  loaded: boolean;
  periodo: Periodo;
}

export const adapter: EntityAdapter<RecepcionDeCompra> = createEntityAdapter<
  RecepcionDeCompra
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  periodo: Periodo.fromStorage(RecepcionesDeCompraPeriodoStoeKey)
});

export function reducer(
  state = initialState,
  action: RecepcionesActions
): State {
  switch (action.type) {
    case RecepcionActionTypes.SetPeriodo: {
      const periodo = action.payload.periodo;
      return {
        ...state,
        periodo
      };
    }

    case RecepcionActionTypes.LoadRecepciones: {
      return {
        ...state,
        loading: true
      };
    }

    case RecepcionActionTypes.LoadRecepcionesFail: {
      return {
        ...state,
        loading: false
      };
    }
    case RecepcionActionTypes.LoadRecepcionesSuccess: {
      return adapter.addAll(action.payload.recepciones, {
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

export const getRecepcionesLoading = (state: State) => state.loading;
export const getRecepcionesLoaded = (state: State) => state.loaded;
export const getRecepcionesPeriodo = (state: State) => state.periodo;
