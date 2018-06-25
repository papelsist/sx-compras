import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromActions from '../actions/auth.actions';

import { User } from '../../models/user';
import { AuthSession, readFromStore } from '../../models/authSession';

export interface AuthState {
  user: User;
  session: AuthSession;
  loading: boolean;
  authError: any;
}

const initialState: AuthState = {
  session: readFromStore(),
  user: undefined,
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
      return {
        ...state,
        loading: false,
        session: undefined,
        authError
      };
    }
    case fromActions.AuthActionTypes.LOGIN_SUCCESS: {
      const session = action.payload;
      return {
        ...state,
        session,
        user: undefined,
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

export const getSession = createSelector(getAuthState, state => state.session);

export const getLoggedIn = createSelector(
  getAuthState,
  state => state.session !== null
);

export const getAuthError = createSelector(
  getAuthState,
  state => state.authError
);
