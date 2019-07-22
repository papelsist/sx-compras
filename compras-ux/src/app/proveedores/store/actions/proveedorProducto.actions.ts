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
  '[ProveedorProductos] Update proveedor producto success';

export const EDIT_PROVEEDOR_PRODUCTO_ACTION =
  '[ProveedorProductos] Edit proveedor producto';

export const SELECT_PRODUCTOS_TO_ADD =
  '[ProveedorProductos] Select productos to add ';

export const ADD_PROVEEDOR_PRODUCTOS =
  '[ProveedorProductos] Add proveedor productos';
export const ADD_PROVEEDOR_PRODUCTOS_FAIL =
  '[ProveedorProductos] Add proveedor productos fail';
export const ADD_PROVEEDOR_PRODUCTOS_SUCCESS =
  '[ProveedorProductos] Add proveedor productos succes';

export const DELETE_PROVEEDOR_PRODUCTO =
  '[ProveedorProductos] Delete proveedor producto';
export const DELETE_PROVEEDOR_PRODUCTO_FAIL =
  '[ProveedorProductos] Delete proveedor producto fail';
export const DELETE_PROVEEDOR_PRODUCTO_SUCCESS =
  '[ProveedorProductos] Delete proveedor producto success';

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
  constructor(public payload: { proveedorId: string; moneda: string }) {}
}
export class AddProveedorProductos implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTOS;
  constructor(
    public payload: { proveedorId: string; moneda: string; productos: string[] }
  ) {}
}
export class AddProveedorProductosFail implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTOS_FAIL;
  constructor(public payload: any) {}
}
export class AddProveedorProductosSuccess implements Action {
  readonly type = ADD_PROVEEDOR_PRODUCTOS_SUCCESS;
  constructor(public payload: ProveedorProducto[]) {}
}

// Delete
export class DeleteProveedorProducto implements Action {
  readonly type = DELETE_PROVEEDOR_PRODUCTO;
  constructor(public payload: ProveedorProducto) {}
}

export class DeleteProveedorProductoFail implements Action {
  readonly type = DELETE_PROVEEDOR_PRODUCTO_FAIL;
  constructor(public payload: any) {}
}

export class DeleteProveedorProductoSuccess implements Action {
  readonly type = DELETE_PROVEEDOR_PRODUCTO_SUCCESS;
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
  | AddProveedorProductos
  | AddProveedorProductosFail
  | AddProveedorProductosSuccess
  | SelectProductosToAdd
  | DeleteProveedorProducto
  | DeleteProveedorProductoFail
  | DeleteProveedorProductoSuccess;
