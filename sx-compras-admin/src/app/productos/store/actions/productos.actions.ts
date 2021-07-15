import { Action } from '@ngrx/store';

import { Producto } from '../../models/producto';

export const LOAD_PRODUCTOS = '[Catalogos] Load productos';
export const LOAD_PRODUCTOS_FAIL = '[Catalogos] Load productos fail';
export const LOAD_PRODUCTOS_SUCCESS = '[Catalogos] Load productos success';

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

// Create actions

export const CREATE_PRODUCTO = '[Catalogos] Create Productos';
export const CREATE_PRODUCTO_FAIL = '[Catalogos] Create Productos Fail';
export const CREATE_PRODUCTO_SUCCESS = '[Catalogos] Create Productos Success';

export class CreateProducto implements Action {
  readonly type = CREATE_PRODUCTO;
  constructor(public payload: Producto) {}
}

export class CreateProductoFail implements Action {
  readonly type = CREATE_PRODUCTO_FAIL;
  constructor(public payload: any) {}
}

export class CreateProductoSuccess implements Action {
  readonly type = CREATE_PRODUCTO_SUCCESS;
  constructor(public payload: Producto) {}
}

// Update actions

export const UPDATE_PRODUCTO = '[Catalogos] Update producto';
export const UPDATE_PRODUCTO_ECOMMERCE = '[Catalogos] Update producto Ecommerce';
export const UPDATE_PRODUCTO_FAIL = '[Catalogos] Update producto Fail';
export const UPDATE_PRODUCTO_SUCCESS = '[Catalogos] Update producto Success';



export const UPSERT_PRODUCTO = '[Catalogos] Upsert producto';

export class UpdateProducto implements Action {
  readonly type = UPDATE_PRODUCTO;
  constructor(public payload: Producto) {}
}

export class UpdateProductoEcommerce implements Action {

  readonly type = UPDATE_PRODUCTO_ECOMMERCE;
  constructor(public payload: Producto) {}
}

export class UpdateProductoFail implements Action {
  readonly type = UPDATE_PRODUCTO_FAIL;
  constructor(public payload: any) {}
}

export class UpdateProductoSuccess implements Action {
  readonly type = UPDATE_PRODUCTO_SUCCESS;
  constructor(public payload: Producto) {}
}

export class UpsertProducto implements Action {
  readonly type = UPSERT_PRODUCTO;
  constructor(public payload: Producto) {}
}

// Remove actions
export const REMOVE_PRODUCTO = '[Catalogos] Remove producto';
export const REMOVE_PRODUCTO_FAIL = '[Catalogos] Remove producto fail';
export const REMOVE_PRODUCTO_SUCCESS = '[Catalogos] Remove producto success';

export class RemoveProducto implements Action {
  readonly type = REMOVE_PRODUCTO;
  constructor(public payload: Producto) {}
}

export class RemoveProductoFail implements Action {
  readonly type = REMOVE_PRODUCTO_FAIL;
  constructor(public payload: any) {}
}

export class RemoveProductoSuccess implements Action {
  readonly type = REMOVE_PRODUCTO_SUCCESS;
  constructor(public payload: Producto) {}
}

export const SEARCH_PRODUCTOS = '[Catalogos] Search productos';
export const SEARCH_PRODUCTOS_FAIL = '[Catalogos] Search productos fail';
export const SEARCH_PRODUCTOS_SUCCESS = '[Catalogos] Search productos success';

export class SearchProductos implements Action {
  readonly type = SEARCH_PRODUCTOS;
  constructor(public payload: { term: string }) {}
}

export class SearchProductosFail implements Action {
  readonly type = SEARCH_PRODUCTOS_FAIL;
  constructor(public payload: any) {}
}

export class SearchProductosSuccess implements Action {
  readonly type = SEARCH_PRODUCTOS_SUCCESS;
  constructor(public payload: Producto[]) {}
}

export type ProductosAction =
  | LoadProductos
  | LoadProductosFail
  | LoadProductosSuccess
  | CreateProducto
  | CreateProductoFail
  | CreateProductoSuccess
  | UpdateProducto
  | UpdateProductoEcommerce
  | UpdateProductoFail
  | UpdateProductoSuccess
  | UpsertProducto
  | RemoveProducto
  | RemoveProductoFail
  | RemoveProductoSuccess
  | SearchProductos
  | SearchProductosFail
  | SearchProductosSuccess;
