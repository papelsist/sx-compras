import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CuentaDeBanco } from 'app/models';

export enum CuentaActionTypes {
  LoadCuentas = '[Cuentas Guard] Load Cuentas',
  LoadCuentasFail = '[Cuenta API] Load Cuentas fail',
  LoadCuentasSuccess = '[Cuenta API] Load Cuentas Success',
  UpsertCuenta = '[Cuenta Guard] Upsert Cuenta',
  UpdateCuenta = '[Cuenta Component] Update Cuenta',
  UpdateCuentaFail = '[Cuenta API] Update Cuenta Fail',
  UpdateCuentaSuccess = '[Cuenta API] Update Cuenta Success'
}

export class LoadCuentas implements Action {
  readonly type = CuentaActionTypes.LoadCuentas;
}
export class LoadCuentasFail implements Action {
  readonly type = CuentaActionTypes.LoadCuentasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCuentasSuccess implements Action {
  readonly type = CuentaActionTypes.LoadCuentasSuccess;

  constructor(public payload: { cuentas: CuentaDeBanco[] }) {}
}

export class UpdateCuenta implements Action {
  readonly type = CuentaActionTypes.UpdateCuenta;

  constructor(public payload: { cuenta: Update<CuentaDeBanco> }) {}
}
export class UpdateCuentaFail implements Action {
  readonly type = CuentaActionTypes.UpdateCuentaFail;

  constructor(public payload: { response: any }) {}
}
export class UpdateCuentaSuccess implements Action {
  readonly type = CuentaActionTypes.UpdateCuentaSuccess;

  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}

export class UpsertCuenta implements Action {
  readonly type = CuentaActionTypes.UpsertCuenta;

  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}

export type CuentaActions =
  | LoadCuentas
  | LoadCuentasFail
  | LoadCuentasSuccess
  | UpdateCuenta
  | UpdateCuentaFail
  | UpdateCuentaSuccess
  | UpsertCuenta;
