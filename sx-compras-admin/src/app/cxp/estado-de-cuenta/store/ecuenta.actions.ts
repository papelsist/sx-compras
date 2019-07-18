import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from 'app/cxp/model';

export enum EstadoDeCuentaActionTypes {
  SetProveedor = '[Estado de cuenta component] Set Proveedor ',
  SetPeriodo = '[Estado de cuenta component] Set Periodo ',
  LoadEstadoDeCuenta = '[Estado de cuenta component] Load estado de cuenta ',
  LoadEstadoDeCuentaFail = '[Estado de cuenta component] Load estado de cuenta fail',
  LoadEstadoDeCuentaSuccess = '[Estado de cuenta component] Load estado de cuenta success',
  LoadFacturas = '[Estado de cuenta Facs component] Load facturas ',
  LoadFacturasFail = '[Estado de cuenta Facs component] Load facturas fail',
  LoadFacturasSuccess = '[Estado de cuenta Facs component] Load facturas success'
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
  constructor(public payload: { periodo: Periodo; proveedorId: string }) {}
}
export class LoadEstadoDeCuentaFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail;
  constructor(public payload: { response: any }) {}
}
export class LoadEstadoDeCuentaSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaSuccess;
  constructor(public payload: { data: any }) {}
}

// Load Facturas
export class LoadFacturas implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadFacturas;
  constructor(public payload: { periodo: Periodo; proveedorId: string }) {}
}
export class LoadFacturasFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadFacturasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadFacturasSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadFacturasSuccess;
  constructor(public payload: { facturas: CuentaPorPagar[] }) {}
}

export type EstadoDeCuentaActions =
  | SetProveedor
  | SetPeriodo
  | LoadEstadoDeCuenta
  | LoadEstadoDeCuentaFail
  | LoadEstadoDeCuentaSuccess
  | LoadFacturas
  | LoadFacturasFail
  | LoadFacturasSuccess;
