import { Action } from '@ngrx/store';
import { ProveedorProducto } from '../../models/proveedorProducto';

export const LOAD_PROVEEDOR_PRODUCTOS =
  '[ProveedorProductos] Load proveedor productos';
export const LOAD_PROVEEDOR_PRODUCTOS_FAIL =
  '[ProveedorProductos] Load proveedor productos Fail';
export const LOAD_PROVEEDOR_PRODUCTOS_SUCCESS =
  '[ProveedorProductos] Load proveedor productos Success';

export const SET_PROVEEDOR_PRODUCTOS_FILTER =
  '[ProveedorProductos] Search proveedor producto filter';

export const UPDATE_PROVEEDOR_PRODUCTO_ACTION =
  '[ProveedorProductos] Update proveedor producto';
export const UPDATE_PROVEEDOR_PRODUCTO_ACTION_FAIL =
  '[ProveedorProductos] Update proveedor producto fail';
export const UPDATE_PROVEEDOR_PRODUCTO_ACTION_SUCCESS =
  '[Proveedor] Update proveedor success';

export const EDIT_PROVEEDOR_PRODUCTO_ACTION =
  '[ProveedorProductos] Edit proveedor producto';

export const SELECT_PRODUCTOS_TO_ADD =
  '[ProveedorProductos] Select productos to add ';

export const ADD_PROVEEDOR_PRODUCTO =
  '[ProveedorProductos] Add proveedor producto';
export const ADD_PROVEEDOR_PRODUCTO_FAIL =
  '[ProveedorProductos] Add proveedor producto fail';
export const ADD_PROVEEDOR_PRODUCTO_SUCCESS =
  '[ProveedorProductos] Add proveedor producto succes';

export class LoadProveedorProductos implements Action {
  readonly type = LOAD_PROVEEDOR_PRODUCTOS;
  constructor(public payload: string) {}
}

export class LoadProveedorProductosFail implements Action {
  readonly type = LOAD_PROVEEDOR_PRODUCTOS_FAIL;
  constructor(public payload: any) {}
}

export class LoadProveedorProductosSuccess implements Action {
  readonly type = LOAD_PROVEEDOR_PRODUCTOS_SUCCESS;
  constructor(public payload: ProveedorProducto[]) {}
}

export class SetProveedorProductoSearchFilter implements Action {
  readonly type = SET_PROVEEDOR_PRODUCTOS_FILTER;
  constructor(public payload: any) {}
}

// CRUD Actions
export class UpdateProveedorProducto implements Action {
  readonly type = UPDATE_PROVEEDOR_PRODUCTO_ACTION;
  constructor(public payload: ProveedorProducto) {}
}
export class UpdateProveedorProductoFail implements Action {
  readonly type = UPDATE_PROVEEDOR_PRODUCTO_ACTION_FAIL;
  constructor(public payload: any) {}
}
export class UpdateProveedorProductoSuccess implements Action {
  readonly type = UPDATE_PROVEEDOR_PRODUCTO_ACTION_SUCCESS;
  constructor(public payload: ProveedorProducto) {}
}

export class EditProveedorProducto implements Action {
  readonly type = EDIT_PROVEEDOR_PRODUCTO_ACTION;
  constructor(public payload: ProveedorProducto) {}
}

// Add
export class SelectProductosToAdd implements Action {
  readonly type = SELECT_PRODUCTOS_TO_ADD;
  constructor(public payload: string) {}
}
export class AddProveedorProducto implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTO;
  constructor(public payload: ProveedorProducto) {}
}
export class AddProveedorProductoFail implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTO_FAIL;
  constructor(public payload: any) {}
}
export class AddProveedorProductoSuccess implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTO_SUCCESS;
  constructor(public payload: ProveedorProducto) {}
}

export type ProveedorProductosActions =
  | LoadProveedorProductos
  | LoadProveedorProductosFail
  | LoadProveedorProductosSuccess
  | SetProveedorProductoSearchFilter
  | UpdateProveedorProducto
  | UpdateProveedorProductoFail
  | UpdateProveedorProductoSuccess
  | EditProveedorProducto
  | AddProveedorProducto
  | AddProveedorProductoFail
  | AddProveedorProductoSuccess
  | SelectProductosToAdd;
