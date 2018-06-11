import { Action } from '@ngrx/store';

import { Authenticate } from '../../models/authenticate';
import { User } from '../../models/user';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login success',
  LOGIN_FAIL = '[Auth] Login fail'
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
  constructor(public payload: User) {}
}

export type AuthActions = Login | LoginFail | LoginSuccess;
