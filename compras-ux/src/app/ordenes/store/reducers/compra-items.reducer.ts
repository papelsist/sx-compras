import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CompraDet } from 'app/ordenes/models/compraDet';
import { CompraDetActions } from '../actions';

export interface State extends EntityState<CompraDet> {
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<CompraDet> = createEntityAdapter<
  CompraDet
>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false
});

export function reducer(state = initialState, action: CompraDetActions): State {
  switch (action.type) {
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

export const getCompraItemsLoading = (state: State) => state.loading;
export const getCompraItemsLoaded = (state: State) => state.loaded;
