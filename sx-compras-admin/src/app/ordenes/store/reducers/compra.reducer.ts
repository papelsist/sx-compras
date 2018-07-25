import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Compra } from '../../models/compra';
import { CompraActions, CompraActionTypes } from '../actions/compra.actions';

export interface State extends EntityState<Compra> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Compra> = createEntityAdapter<Compra>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(state = initialState, action: CompraActions): State {
  switch (action.type) {
    case CompraActionTypes.AddCompra: {
      return adapter.addOne(action.payload.compra, state);
    }

    case CompraActionTypes.UpsertCompra: {
      return adapter.upsertOne(action.payload.compra, state);
    }

    case CompraActionTypes.AddCompras: {
      return adapter.addMany(action.payload.compras, state);
    }

    case CompraActionTypes.UpsertCompras: {
      return adapter.upsertMany(action.payload.compras, state);
    }

    case CompraActionTypes.UpdateCompra: {
      return adapter.updateOne(action.payload.compra, state);
    }

    case CompraActionTypes.UpdateCompras: {
      return adapter.updateMany(action.payload.compras, state);
    }

    case CompraActionTypes.DeleteCompra: {
      return adapter.removeOne(action.payload.id, state);
    }

    case CompraActionTypes.DeleteCompras: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case CompraActionTypes.LoadCompras: {
      return adapter.addAll(action.payload.compras, state);
    }

    case CompraActionTypes.ClearCompras: {
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
