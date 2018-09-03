import { Action } from '@ngrx/store';

import { Sucursal } from '../../models';

export enum ApplicationActionTypes {
  LoadSucursal = '[Application] LoadSucursal',
  LoadSucursalFail = '[Application] LoadSucursal fail',
  LoadSucursalSuccess = '[Application] LoadSucursal success',
  SetGlobalLoading = '[Application] Set global loading'
}

export class LoadSucursal implements Action {
  readonly type = ApplicationActionTypes.LoadSucursal;
  constructor(public payload: { url: string }) {}
}
export class LoadSucursalFail implements Action {
  readonly type = ApplicationActionTypes.LoadSucursalFail;
  constructor(public payload: any) {}
}
export class LoadSucursalSuccess implements Action {
  readonly type = ApplicationActionTypes.LoadSucursalSuccess;
  constructor(public payload: { sucursal: Sucursal }) {}
}

export class SetGlobalLoading implements Action {
  readonly type = ApplicationActionTypes.SetGlobalLoading;
  constructor(public payload: { loading: boolean }) {}
}

export type ApplicationActions =
  | LoadSucursal
  | LoadSucursalFail
  | LoadSucursalSuccess
  | SetGlobalLoading;
