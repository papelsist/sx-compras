import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { Proveedor } from 'app/proveedores/models/proveedor';

export enum EstadoDeCuentaActionTypes {
  SetProveedor = '[Estado de cuenta component] Set Proveedor ',
  SetPeriodo = '[Estado de cuenta component] Set Periodo ',
  LoadEstadoDeCuenta = '[Estado de cuenta component] Load estado de cuenta ',
  LoadEstadoDeCuentaFail = '[Estado de cuenta component] Load estado de cuenta fail',
  LoadEstadoDeCuentaSuccess = '[Estado de cuenta component] Load estado de cuenta success'
}

export class SetProveedor implements Action {
  readonly type = EstadoDeCuentaActionTypes.SetProveedor;
  constructor(public payload: { proveedor: Proveedor }) {}
}
export class SetPeriodo implements Action {
  readonly type = EstadoDeCuentaActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}
export class LoadEstadoDeCuenta implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuenta;
  constructor(public payload: { periodo: Periodo; proveedor: Proveedor }) {}
}
export class LoadEstadoDeCuentaFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail;
  constructor(public payload: { response: any }) {}
}
export class LoadEstadoDeCuentaSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaSuccess;
  constructor(public payload: { data: any }) {}
}

export type EstadoDeCuentaActions =
  | SetProveedor
  | SetPeriodo
  | LoadEstadoDeCuenta
  | LoadEstadoDeCuentaFail
  | LoadEstadoDeCuentaSuccess;
