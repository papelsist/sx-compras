import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromActions from '../actions/auth.actions';

import { User } from '../../models/user';

export interface AuthState {
  token: string;
  user: User;
  loggedIn: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: undefined,
  user: undefined,
  loggedIn: false,
  loading: false
};

export function reducer(state = initialState, action: fromActions.AuthActions) {
  switch (action.type) {
    case fromActions.AuthActionTypes.LOGIN: {
      return  {
        ...state,
        loading: false
      };
    }
    case fromActions.AuthActionTypes.LOGIN_FAIL: {
      return  {
        ...state,
        loading: false
      };
    }
    case fromActions.AuthActionTypes.LOGIN_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        user,
        loading: false
      };
    }
  }
  return state;
}

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getAuthLoading = createSelector(getAuthState, state => state.loading);
export const getIsLoggedIn = createSelector(getAuthState, state => state.loggedIn);

