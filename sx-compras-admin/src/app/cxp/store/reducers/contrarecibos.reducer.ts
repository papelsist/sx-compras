import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Contrarecibo } from '../../model';
import {
  ContrareciboActions,
  ContrareciboActionTypes
} from '../actions/contrarecibos.actions';

export interface State extends EntityState<Contrarecibo> {
  loading: boolean;
  loaded: boolean;
}

export function sortByModificado(a: Contrarecibo, b: Contrarecibo): number {
  return b.id > a.id ? 1 : -1;
}

export const adapter: EntityAdapter<Contrarecibo> = createEntityAdapter<
  Contrarecibo
>({ sortComparer: sortByModificado });

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: ContrareciboActions
): State {
  switch (action.type) {
    case ContrareciboActionTypes.DeleteContrarecibo:
    case ContrareciboActionTypes.AddContrarecibo:
    case ContrareciboActionTypes.LoadContrarecibos: {
      return {
        ...state,
        loading: true
      };
    }

    case ContrareciboActionTypes.DeleteContrareciboFail:
    case ContrareciboActionTypes.UpdateContrareciboFail:
    case ContrareciboActionTypes.AddContrareciboFail:
    case ContrareciboActionTypes.LoadContrarecibosFail: {
      return {
        ...state,
        loading: false
      };
    }
    case ContrareciboActionTypes.LoadContrarecibosSuccess: {
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case ContrareciboActionTypes.AddContrareciboSuccess: {
      return adapter.addOne(action.payload, {
        ...state,
        loading: false
      });
    }

    case ContrareciboActionTypes.UpdateContrareciboSuccess: {
      const compra = action.payload;
      return adapter.updateOne(
        {
          id: compra.id,
          changes: compra
        },
        {
          ...state,
          loading: false
        }
      );
    }

    case ContrareciboActionTypes.UpsertContrarecibo: {
      return adapter.upsertOne(action.payload.recibo, {
        ...state,
        loading: false
      });
    }

    case ContrareciboActionTypes.DeleteContrareciboSuccess: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false
      });
    }

    case ContrareciboActionTypes.ClearContrarecibos: {
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

export const getContrarecibosLoading = (state: State) => state.loading;
export const getContrarecibosLoaded = (state: State) => state.loaded;
