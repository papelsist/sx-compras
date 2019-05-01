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
    case fromActions.FacturistaActionTypes.DeleteFacturista:
    case fromActions.FacturistaActionTypes.UpdateFacturista:
    case fromActions.FacturistaActionTypes.CreateFacturista:
    case fromActions.FacturistaActionTypes.LoadFacturistas: {
      return {
        ...state,
        loading: true
      };
    }
    case fromActions.FacturistaActionTypes.DeleteFacturistaFail:
    case fromActions.FacturistaActionTypes.UpdateFacturistaFail:
    case fromActions.FacturistaActionTypes.CreateFacturistaFail:
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

    case fromActions.FacturistaActionTypes.UpdateFacturistaSuccess:
    case fromActions.FacturistaActionTypes.CreateFacturistaSuccess: {
      return adapter.upsertOne(action.payload.facturista, {
        ...state,
        loading: false
      });
    }

    case fromActions.FacturistaActionTypes.DeleteFacturistaSuccess: {
      return adapter.removeOne(action.payload.facturistaId, {
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

export const getFacturistasLoading = (state: State) => state.loading;
export const getFacturistasLoaded = (state: State) => state.loaded;
