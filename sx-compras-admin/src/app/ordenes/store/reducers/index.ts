import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromAlcance from './alcance.reducer';
import * as fromCompras from './compra.reducer';

export interface State {
  compras: fromCompras.State;
  alcance: fromAlcance.State;
}

export const reducers: ActionReducerMap<State> = {
  compras: fromCompras.reducer,
  alcance: fromAlcance.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

/**
 * Generado con ng g store ordenes/State -m ordenes.module.ts --statePath store/reducers
 */
