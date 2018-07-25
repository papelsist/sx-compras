import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromAlcance from './alcance.reducer';

export interface State {  alcance: fromAlcance.State;
}

export const reducers: ActionReducerMap<State> = {  alcance: fromAlcance.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

/**
 * Generado con ng g store ordenes/State -m ordenes.module.ts --statePath store/reducers
 */
