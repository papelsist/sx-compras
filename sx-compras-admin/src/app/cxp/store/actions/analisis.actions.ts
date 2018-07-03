import { Action } from '@ngrx/store';

import { Analisis } from '../../model/analisis';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';
import { Periodo } from 'app/_core/models/periodo';

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
  UPDATE_ANALISIS_SUCCESS = '[Analisis de factura] Update Success',

  DELETE_ANALISIS = '[Analisis de factura] Delete',
  DELETE_ANALISIS_FAIL = '[Analisis de factura] Delete Fail',
  DELETE_ANALISIS_SUCCESS = '[Analisis de factura] Delete Success',
  // Cerrar el analisis
  CERRAR_ANALISIS = '[Analisis de factura] Cerrar',
  CERRAR_ANALISIS_FAIL = '[Analisis de factura] Cerrar Fail',
  CERRAR_ANALISIS_SUCCESS = '[Analisis de factura] Cerrar Success',
  // Search analisis
  SEARCH = '[Analisis de factura] Search',
  SEARCH_COMPLETE = '[Analisis de factura] Search Complete',
  SEARCH_ERROR = '[Analisis de factura] Search Error',

  SET_ANALSIS_PERIODO = '[Analisis de factura], Set Analisis Periodo',
  SET_SEARCH_FILTER = '[Analisis de factura], Set Search Filter'
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
  constructor(public payload: Partial<Proveedor>) {}
}
export class LoadComsPendientesFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_COMS_PENDIENTES_FAIL;
  constructor(public payload: any) {}
}
export class LoadComsPendientesSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_COMS_PENDIENTES_SUCCESS;
  constructor(public payload: RecepcionDeCompra[]) {}
}

// Save
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

// Update
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

// Delete
export class DeleteAnalisis implements Action {
  readonly type = AnalisisActionTypes.DELETE_ANALISIS;
  constructor(public payload: Analisis) {}
}
export class DeleteAnalisisFail implements Action {
  readonly type = AnalisisActionTypes.DELETE_ANALISIS_FAIL;
  constructor(public payload: any) {}
}
export class DeleteAnalisisSuccess implements Action {
  readonly type = AnalisisActionTypes.DELETE_ANALISIS_SUCCESS;
  constructor(public payload: Analisis) {}
}

// Cerrar
export class CerrarAnalisis implements Action {
  readonly type = AnalisisActionTypes.CERRAR_ANALISIS;
  constructor(public payload: Analisis) {}
}
export class CerrarAnalisisFail implements Action {
  readonly type = AnalisisActionTypes.CERRAR_ANALISIS_FAIL;
  constructor(public payload: any) {}
}
export class CerrarAnalisisSuccess implements Action {
  readonly type = AnalisisActionTypes.CERRAR_ANALISIS_SUCCESS;
  constructor(public payload: Analisis) {}
}

// Search actions
export class Search implements Action {
  readonly type = AnalisisActionTypes.SEARCH;
  constructor(public payload: any) {}
}
export class SearchError implements Action {
  readonly type = AnalisisActionTypes.SEARCH_ERROR;
  constructor(public payload: any) {}
}
export class SearComplete implements Action {
  readonly type = AnalisisActionTypes.SEARCH_COMPLETE;
  constructor(public payload: Analisis[]) {}
}
export class SetAnalisisPeriodo implements Action {
  readonly type = AnalisisActionTypes.SET_ANALSIS_PERIODO;
  constructor(public payload: Periodo) {}
}
export class SetSearchFilter implements Action {
  readonly type = AnalisisActionTypes.SET_SEARCH_FILTER;
  constructor(public payload: any) {}
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
  | UpdateAnalisisSuccess
  | DeleteAnalisis
  | DeleteAnalisisFail
  | DeleteAnalisisSuccess
  | CerrarAnalisis
  | CerrarAnalisisFail
  | CerrarAnalisisSuccess
  | Search
  | SearchError
  | SearComplete
  | SetAnalisisPeriodo
  | SetSearchFilter;
