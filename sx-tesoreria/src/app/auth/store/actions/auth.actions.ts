import { Action } from '@ngrx/store';

import { Authenticate } from '../../models/authenticate';
import { User } from '../../models/user';
import { AuthSession } from '../../models/authSession';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAIL = '[Auth] Login Fail',
  LOGIN_REDIRECT = '[Auth] Login Redirect',
  LOGOUT = '[Auth] Logout',
  LoadSession = '[Auth effect] Load session',
  LoadSessionSuccess = '[Auth Effect] Load session success'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: Authenticate) {}
}
export class LoginFail implements Action {
  readonly type = AuthActionTypes.LOGIN_FAIL;
  constructor(public payload: any) {}
}
export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: AuthSession) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LOGIN_REDIRECT;
}

export class LoadSession implements Action {
  readonly type = AuthActionTypes.LoadSession;
}
export class LoadSessionSuccess implements Action {
  readonly type = AuthActionTypes.LoadSessionSuccess;
  constructor(public payload: any) {}
}

export type AuthActions =
  | Login
  | LoginFail
  | LoginSuccess
  | Logout
  | LoginRedirect
  | LoadSession
  | LoadSessionSuccess;
