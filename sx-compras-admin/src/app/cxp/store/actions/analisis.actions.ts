import { Action } from '@ngrx/store';

import { Analisis } from '../../model/analisis';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';

export enum AnalisisActionTypes {
  LOAD = '[Analisis de factura] Load',
  LOAD_FAIL = '[Analisis de factura] Load Fail',
  LOAD_SUCCESS = '[Analisis de factura] Load Success',
  // CRUD Actions
  SET_CURRENT_PROVEEDOR = '[Analisis de factura] Set current Proveedor',
  LOAD_FACTURAS_PENDIENTES = '[Analisis de factura] Load facturas pendientes',
  LOAD_FACTURAS_PENDIENTES_FAIL = '[Analisis de factura] Load facturas pendientes fail',
  LOAD_FACTURAS_PENDIENTES_SUCCESS = '[Analisis de factura] Load facturas pendientes success',
  LOAD_COMS_PENDIENTES = '[Analisis de factura] Load Coms pendientes',
  LOAD_COMS_PENDIENTES_FAIL = '[Analisis de factura] Load Coms pendientes fail',
  LOAD_COMS_PENDIENTES_SUCCESS = '[Analisis de factura] Load Coms pendientes success',
  // CRUD
  SAVE_ANALISIS = '[Analisis de factura] Save',
  SAVE_ANALISIS_FAIL = '[Analisis de factura] Save fail',
  SAVE_ANALISIS_SUCCESS = '[Analisis de factura] Save success',

  UPDATE_ANALISIS = '[Analisis de factura] Update',
  UPDATE_ANALISIS_FAIL = '[Analisis de factura] Update Fail',
  UPDATE_ANALISIS_SUCCESS = '[Analisis de factura] Update Success'
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
  constructor(public payload: Proveedor) {}
}
export class LoadFacturasPendientesFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_FAIL;
  constructor(public payload: any) {}
}
export class LoadFacturasPendientesSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_FACTURAS_PENDIENTES_SUCCESS;
  constructor(public payload: CuentaPorPagar[]) {}
}

// COMS
export class LoadComsPendientes implements Action {
  readonly type = AnalisisActionTypes.LOAD_COMS_PENDIENTES;
  constructor(public payload: Proveedor) {}
}
export class LoadComsPendientesFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_COMS_PENDIENTES_FAIL;
  constructor(public payload: any) {}
}
export class LoadComsPendientesSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_COMS_PENDIENTES_SUCCESS;
  constructor(public payload: RecepcionDeCompra[]) {}
}

// CRUD
export class SaveAnalisis implements Action {
  readonly type = AnalisisActionTypes.SAVE_ANALISIS;
  constructor(public payload: Analisis) {}
}
export class SaveAnalisisFail implements Action {
  readonly type = AnalisisActionTypes.SAVE_ANALISIS_FAIL;
  constructor(public payload: any) {}
}
export class SaveAnalisisSuccess implements Action {
  readonly type = AnalisisActionTypes.SAVE_ANALISIS_SUCCESS;
  constructor(public payload: Analisis) {}
}
export class UpdateAnalisis implements Action {
  readonly type = AnalisisActionTypes.UPDATE_ANALISIS;
  constructor(public payload: Analisis) {}
}
export class UpdateAnalisisFail implements Action {
  readonly type = AnalisisActionTypes.UPDATE_ANALISIS_FAIL;
  constructor(public payload: any) {}
}
export class UpdateAnalisisSuccess implements Action {
  readonly type = AnalisisActionTypes.UPDATE_ANALISIS_SUCCESS;
  constructor(public payload: Analisis) {}
}

export type AnalisisActions =
  | Load
  | LoadFail
  | LoadSuccess
  | SetCurrentProveedor
  | LoadFacturasPendientes
  | LoadFacturasPendientesFail
  | LoadFacturasPendientesSuccess
  | LoadComsPendientes
  | LoadComsPendientesFail
  | LoadComsPendientesSuccess
  | SaveAnalisis
  | SaveAnalisisFail
  | SaveAnalisisSuccess
  | UpdateAnalisis
  | UpdateAnalisisFail
  | UpdateAnalisisSuccess;
