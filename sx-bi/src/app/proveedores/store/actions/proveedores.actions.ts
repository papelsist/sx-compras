import { Action } from '@ngrx/store';
import { Proveedor } from '../../models/proveedor';

export const LOAD_PROVEEDORES = '[Proveedor] Load proveedores';
export const LOAD_PROVEEDORES_FAIL = '[Proveedor] Load proveedores Fail';
export const LOAD_PROVEEDORES_SUCCESS = '[Proveedor] Load proveedores Success';

export const SET_PROVEEDORES_FILTER = '[Proveedor] Search proveedor filter';
export const SET_CURRENT_PORVEEDOR = '[Proveedor] Set current proveedor';

export const UPDATE_PROVEEDOR_ACTION = '[Proveedor] Update proveedor';
export const UPDATE_PROVEEDOR_ACTION_FAIL = '[Proveedor] Update proveedor fail';
export const UPDATE_PROVEEDOR_ACTION_SUCCESS =
  '[Proveedor] Update proveedor success';
export const CREATE_PROVEEDOR_ACTION = '[Proveedor] Create proveedor';
export const CREATE_PROVEEDOR_ACTION_FAIL = '[Proveedor] Create proveedor fail';
export const CREATE_PROVEEDOR_ACTION_SUCCESS =
  '[Proveedor] Create proveedor success';

export class LoadProveedores implements Action {
  readonly type = LOAD_PROVEEDORES;
}

export class LoadProveedoresFail implements Action {
  readonly type = LOAD_PROVEEDORES_FAIL;
  constructor(public payload: any) {}
}

export class LoadProveedoresSuccess implements Action {
  readonly type = LOAD_PROVEEDORES_SUCCESS;
  constructor(public payload: Proveedor[]) {}
}

export class SetSearchFilter implements Action {
  readonly type = SET_PROVEEDORES_FILTER;
  constructor(public payload: any) {}
}

export class SetCurrentProveedor implements Action {
  readonly type = SET_CURRENT_PORVEEDOR;
  constructor(public payload: string) {}
}

// CRUD Actions

export class CreateProveedor implements Action {
  readonly type = CREATE_PROVEEDOR_ACTION;
  constructor(public payload: Proveedor) {}
}
export class CreateProveedorFail implements Action {
  readonly type = CREATE_PROVEEDOR_ACTION_FAIL;
  constructor(public payload: any) {}
}
export class CreateProveedorSuccess implements Action {
  readonly type = CREATE_PROVEEDOR_ACTION_SUCCESS;
  constructor(public payload: Proveedor) {}
}

export class UpdateProveedor implements Action {
  readonly type = UPDATE_PROVEEDOR_ACTION;
  constructor(public payload: Proveedor) {}
}
export class UpdateProveedorFail implements Action {
  readonly type = UPDATE_PROVEEDOR_ACTION_FAIL;
  constructor(public payload: any) {}
}
export class UpdateProveedorSuccess implements Action {
  readonly type = UPDATE_PROVEEDOR_ACTION_SUCCESS;
  constructor(public payload: Proveedor) {}
}

export type ProveedoresActions =
  | LoadProveedores
  | LoadProveedoresFail
  | LoadProveedoresSuccess
  | SetSearchFilter
  | SetCurrentProveedor
  | UpdateProveedor
  | UpdateProveedorFail
  | UpdateProveedorSuccess
  | CreateProveedor
  | CreateProveedorFail
  | CreateProveedorSuccess;
