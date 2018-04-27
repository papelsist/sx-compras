import { Action } from '@ngrx/store';

import { Producto } from '../../models/producto';

export const LOAD_PRODUCTOS = '[Productos] Load productos';
export const LOAD_PRODUCTOS_FAIL = '[Productos] Load productos fail';
export const LOAD_PRODUCTOS_SUCCESS = '[Productos] Load productos success';

export class LoadProductos implements Action {
  readonly type = LOAD_PRODUCTOS;
}

export class LoadProductosFail implements Action {
  readonly type = LOAD_PRODUCTOS_FAIL;
  constructor(public payload: any) {}
}

export class LoadProductosSuccess implements Action {
  readonly type = LOAD_PRODUCTOS_SUCCESS;
  constructor(public payload: Producto[]) {}
}

export type ProductosAction =
  | LoadProductos
  | LoadProductosFail
  | LoadProductosSuccess;
