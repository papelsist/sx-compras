import { Action } from '@ngrx/store';

import { Analisis } from '../../model/analisis';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { ComprobanteFiscal } from '../../model/comprobanteFiscal';

export enum AnalisisActionTypes {
  LOAD = '[Analisis de factura] Load',
  LOAD_FAIL = '[Analisis de factura] Load Fail',
  LOAD_SUCCESS = '[Analisis de factura] Load Success',
  // CRUD Actions
  SET_CURRENT_PROVEEDOR = '[Analisis de factura] Set current Proveedor',
  LOAD_FACTURAS_PENDIENTES = '[Analisis de factura] Load facturas pendientes',
  LOAD_FACTURAS_PENDIENTES_FAIL = '[Analisis de factura] Load facturas pendientes fail',
  LOAD_FACTURAS_PENDIENTES_SUCCESS = '[Analisis de factura] Load facturas pendientes success'
}

export class Load implements Action {
  readonly type = AnalisisActionTypes.LOAD;
  // constructor(public payload: any) {}
}
export class LoadFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_FAIL;
  constructor(public payload: any) {}
}
export class LoadSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_SUCCESS;
  constructor(public payload: Analisis[]) {}
}

// CRUD related actions
export class SetCurrentProveedor implements Action {
  readonly type = AnalisisActionTypes.SET_CURRENT_PROVEEDOR;
  constructor(public payload: Proveedor) {}
}
export class LoadFacturasPendientes implements Action {
  readonly type = AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES;
}
export class LoadFacturasPendientesFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_FAIL;
  constructor(public payload: any) {}
}
export class LoadFacturasPendientesSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_SUCCESS;
  constructor(public payload: ComprobanteFiscal[]) {}
}

export type AnalisisActions =
  | Load
  | LoadFail
  | LoadSuccess
  | SetCurrentProveedor
  | LoadFacturasPendientes
  | LoadFacturasPendientesFail
  | LoadFacturasPendientesSuccess;
