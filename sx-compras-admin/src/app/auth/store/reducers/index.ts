import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromActions from '../actions/auth.actions';

import { User } from '../../models/user';

export interface AuthState {
  token: string;
  user: User;
  loggedIn: boolean;
  loading: boolean;
  authError: any;
}

const initialState: AuthState = {
  token: undefined,
  user: undefined,
  loggedIn: false,
  loading: false,
  authError: undefined
};

export function reducer(state = initialState, action: fromActions.AuthActions) {
  switch (action.type) {
    case fromActions.AuthActionTypes.LOGIN: {
      return {
        ...state,
        loading: true,
        authError: undefined
      };
    }
    case fromActions.AuthActionTypes.LOGIN_FAIL: {
      const authError = action.payload;
      console.log('Error: ', authError);
      return {
        ...state,
        loading: false,
        authError
      };
    }
    case fromActions.AuthActionTypes.LOGIN_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        user,
        loggedIn: true,
        loading: false,
        authError: undefined
      };
    }
  }
  return state;
}

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getAuthLoading = createSelector(
  getAuthState,
  state => state.loading
);
export const getLoggedIn = createSelector(
  getAuthState,
  state => state.loggedIn
);

export const getAuthError = createSelector(
  getAuthState,
  state => state.authError
);
