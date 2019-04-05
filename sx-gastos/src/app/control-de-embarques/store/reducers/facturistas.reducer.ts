import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

import * as fromActions from '../actions/facturista.actions';

export interface State extends EntityState<FacturistaDeEmbarque> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<FacturistaDeEmbarque> = createEntityAdapter<
  FacturistaDeEmbarque
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: fromActions.FacturistaActions
): State {
  switch (action.type) {
    case fromActions.FacturistaActionTypes.LoadFacturistas: {
      return {
        ...state,
        loading: true
      };
    }

    case fromActions.FacturistaActionTypes.LoadFacturistasFail: {
      return {
        ...state,
        loading: false
      };
    }

    case fromActions.FacturistaActionTypes.LoadFacturistasSuccess: {
      return adapter.addAll(action.payload.facturistas, {
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

export const getFacturistasLoading = (state: State) => state.loading;
export const getFacturistasLoaded = (state: State) => state.loaded;
