import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CuentaDeBanco } from 'app/models';
import { EjercicioMes } from 'app/models/ejercicioMes';

export enum CuentaActionTypes {
  SetPeriodoDeAnalisis = '[SaldoCard component] Set periodo de analisis',
  LoadCuentas = '[Cuentas Guard] Load Cuentas',
  LoadCuentasFail = '[Cuenta API] Load Cuentas fail',
  LoadCuentasSuccess = '[Cuenta API] Load Cuentas Success',
  UpsertCuenta = '[Cuenta Guard] Upsert Cuenta',
  AddCuenta = '[Cuenta Component] Add Cuenta',
  AddCuentaFail = '[Cuenta API] Add Cuenta Fail',
  AddCuentaSuccess = '[Cuenta API] Add Cuenta Success',
  UpdateCuenta = '[Cuenta Component] Update Cuenta',
  UpdateCuentaFail = '[Cuenta API] Update Cuenta Fail',
  UpdateCuentaSuccess = '[Cuenta API] Update Cuenta Success',
  SetSelectedCuenta = '[Cuentas component] Set selected cuenta'
}

export class SetPeriodoDeAnalisis implements Action {
  readonly type = CuentaActionTypes.SetPeriodoDeAnalisis;
  constructor(public payload: { periodo: EjercicioMes }) {}
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

export class AddCuenta implements Action {
  readonly type = CuentaActionTypes.AddCuenta;

  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}
export class AddCuentaFail implements Action {
  readonly type = CuentaActionTypes.AddCuentaFail;

  constructor(public payload: { response: any }) {}
}
export class AddCuentaSuccess implements Action {
  readonly type = CuentaActionTypes.AddCuentaSuccess;

  constructor(public payload: { cuenta: CuentaDeBanco }) {}
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

export class SetSelectedCuenta implements Action {
  readonly type = CuentaActionTypes.SetSelectedCuenta;
  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}

export type CuentaActions =
  | SetPeriodoDeAnalisis
  | LoadCuentas
  | LoadCuentasFail
  | LoadCuentasSuccess
  | AddCuenta
  | AddCuentaFail
  | AddCuentaSuccess
  | UpdateCuenta
  | UpdateCuentaFail
  | UpdateCuentaSuccess
  | UpsertCuenta
  | SetSelectedCuenta;
