import { Action } from '@ngrx/store';
import { Proveedor } from '../../models/proveedor';

export const LOAD_PROVEEDORES = '[Proveedor] Load proveedores';
export const LOAD_PROVEEDORES_FAIL = '[Proveedor] Load proveedores Fail';
export const LOAD_PROVEEDORES_SUCCESS = '[Proveedor] Load proveedores Success';

export class LoadProveedores implements Action {
  readonly type = LOAD_PROVEEDORES;
  constructor(public payload: any) {}
}

export class LoadProveedoresFail implements Action {
  readonly type = LOAD_PROVEEDORES_FAIL;
  constructor(public payload: any) {}
}

export class LoadProveedoresSuccess implements Action {
  readonly type = LOAD_PROVEEDORES_SUCCESS;
  constructor(public payload: Proveedor[]) {}
}

export type ProveedoresActions =
  | LoadProveedores
  | LoadProveedoresFail
  | LoadProveedoresSuccess;
