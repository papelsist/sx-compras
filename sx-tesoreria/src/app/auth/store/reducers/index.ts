import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromActions from '../actions/auth.actions';

import { User } from '../../models/user';
import { AuthSession, readFromStore } from '../../models/authSession';

export interface AuthState {
  session: AuthSession;
  loading: boolean;
  authError: any;
}

const initialState: AuthState = {
  session: readFromStore(),
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

    case fromActions.AuthActionTypes.LOGOUT: {
      return {
        ...state,
        session: undefined
      };
    }
    /*
    case fromActions.AuthActionTypes.LoadSessionSuccess: {
      const user: User = action.payload.user;
      const apiInfo = action.payload.apiInfo;
      return {
        ...state,
        user,
        apiInfo
      };
    }
    */
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

export const getUser = createSelector(getSession, session => session.user);
