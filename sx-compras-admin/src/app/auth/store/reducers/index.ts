import { ActionReducer, createFeatureSelector } from '@ngrx/store';

import * as fromActions from '../actions/auth.actions';

import { User } from '../../models/user';

export interface AuthState {
  token: string;
  user: User;
  loggedIn: boolean;
}

const initialState: AuthState = {
  token: undefined,
  user: undefined,
  loggedIn: false
};

export function reducer(state = initialState, action: fromActions.AuthActions) {
  return state;
}

export const getAuthState = createFeatureSelector<AuthState>('auth');
