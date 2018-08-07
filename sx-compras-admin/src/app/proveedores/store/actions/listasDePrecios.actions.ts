import { Action } from '@ngrx/store';
import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';

export const LOAD_LISTAS_PROVEEDOR = '[ListaDePreciosProveedor] Load';
export const LOAD_LISTAS_PROVEEDOR_FAIL = '[ListaDePreciosProveedor] Load Fail';
export const LOAD_LISTAS_PROVEEDOR_SUCCESS =
  '[ListaDePreciosProveedor] Load Success';

export const ADD_LISTA_PROVEEDOR = '[ListaDePreciosProveedor] Add Lista ';
export const ADD_LISTA_PROVEEDOR_FAIL =
  '[ListaDePreciosProveedor] Add Lista Fail';
export const ADD_LISTA_PROVEEDOR_SUCCESS =
  '[ListaDePreciosProveedor] Add Lista Success';

export const UPDATE_LISTA_PROVEEDOR = '[ListaDePreciosProveedor] Update Lista ';
export const UPDATE_LISTA_PROVEEDOR_FAIL =
  '[ListaDePreciosProveedor] Update Lista Fail';
export const UPDATE_LISTA_PROVEEDOR_SUCCESS =
  '[ListaDePreciosProveedor] Update Lista Success';

export const DELETE_LISTA_PROVEEDOR = '[ListaDePreciosProveedor] Delete Lista ';
export const DELETE_LISTA_PROVEEDOR_FAIL =
  '[ListaDePreciosProveedor] Delete Lista Fail';
export const DELETE_LISTA_PROVEEDOR_SUCCESS =
  '[ListaDePreciosProveedor] Delete Lista Success';

export const APLICAR_LISTA_PROVEEDOR =
  '[ListaDePreciosProveedor] Aplicar Lista ';
export const APLICAR_LISTA_PROVEEDOR_FAIL =
  '[ListaDePreciosProveedor] Aplicar Lista Success Fail';
export const APLICAR_LISTA_PROVEEDOR_SUCCESS =
  '[ListaDePreciosProveedor] Aplicar Lista Success Success';

export const ACTUALIZAR_PRODUCTOS_DE_LISTA_PROVEEDOR =
  '[ListaDePreciosProveedor] Actualiar productos de Lista proveedor ';

export const ACTUALIZAR_COMPRAS_CONLISTA =
  '[ListaDePreciosProveedor] Actualiar compras cont  Lista proveedor ';
export const ACTUALIZAR_COMPRAS_CONLISTA_FAIL =
  '[ListaDePreciosProveedor] Actualiar compras cont  Lista proveedor fail ';
export const ACTUALIZAR_COMPRAS_CONLISTA_SUCCESS =
  '[ListaDePreciosProveedor] Actualiar compras cont  Lista proveedor Success';

export class LoadListasDePreciosProveedor implements Action {
  readonly type = LOAD_LISTAS_PROVEEDOR;
  constructor(public payload: string) {}
}

export class LoadListasDePreciosProveedorFail implements Action {
  readonly type = LOAD_LISTAS_PROVEEDOR_FAIL;
  constructor(public payload: any) {}
}

export class LoadListasDePreciosProveedorSuccess implements Action {
  readonly type = LOAD_LISTAS_PROVEEDOR_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor[]) {}
}

export class AddListaDePreciosProveedor implements Action {
  readonly type = ADD_LISTA_PROVEEDOR;
  constructor(public payload: ListaDePreciosProveedor) {}
}
export class AddListaDePreciosProveedorFail implements Action {
  readonly type = ADD_LISTA_PROVEEDOR_FAIL;
  constructor(public payload: any) {}
}
export class AddListaDePreciosProveedorSuccess implements Action {
  readonly type = ADD_LISTA_PROVEEDOR_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor) {}
}

export class UpdateListaDePreciosProveedor implements Action {
  readonly type = UPDATE_LISTA_PROVEEDOR;
  constructor(public payload: ListaDePreciosProveedor) {}
}
export class UpdateListaDePreciosProveedorFail implements Action {
  readonly type = UPDATE_LISTA_PROVEEDOR_FAIL;
  constructor(public payload: any) {}
}
export class UpdateListaDePreciosProveedorSuccess implements Action {
  readonly type = UPDATE_LISTA_PROVEEDOR_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor) {}
}

export class DeleteListaDePreciosProveedor implements Action {
  readonly type = DELETE_LISTA_PROVEEDOR;
  constructor(public payload: ListaDePreciosProveedor) {}
}
export class DeleteListaDePreciosProveedorFail implements Action {
  readonly type = DELETE_LISTA_PROVEEDOR_FAIL;
  constructor(public payload: any) {}
}
export class DeleteListaDePreciosProveedorSuccess implements Action {
  readonly type = DELETE_LISTA_PROVEEDOR_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor) {}
}

export class AplicarListaProveedor implements Action {
  readonly type = APLICAR_LISTA_PROVEEDOR;
  constructor(public payload: ListaDePreciosProveedor) {}
}
export class AplicarListaProveedorFail implements Action {
  readonly type = APLICAR_LISTA_PROVEEDOR_FAIL;
  constructor(public payload: any) {}
}
export class AplicarListaProveedorSuccess implements Action {
  readonly type = APLICAR_LISTA_PROVEEDOR_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor) {}
}

export class ActualizarProductosDeLista implements Action {
  readonly type = ACTUALIZAR_PRODUCTOS_DE_LISTA_PROVEEDOR;
  constructor(public payload: ListaDePreciosProveedor) {}
}

// Actualizar compras

export class ActualizarComprasConLista implements Action {
  readonly type = ACTUALIZAR_COMPRAS_CONLISTA;
  constructor(
    public payload: { lista: ListaDePreciosProveedor; fecha: Date }
  ) {}
}
export class ActualizarComprasConListaFail implements Action {
  readonly type = ACTUALIZAR_COMPRAS_CONLISTA_FAIL;
  constructor(public payload: any) {}
}
export class ActualizarComprasConListaSuccess implements Action {
  readonly type = ACTUALIZAR_COMPRAS_CONLISTA_SUCCESS;
  constructor(public payload: ListaDePreciosProveedor) {}
}

export type ListasDePreciosActions =
  | LoadListasDePreciosProveedor
  | LoadListasDePreciosProveedorFail
  | LoadListasDePreciosProveedorSuccess
  | AddListaDePreciosProveedor
  | AddListaDePreciosProveedorFail
  | AddListaDePreciosProveedorSuccess
  | UpdateListaDePreciosProveedor
  | UpdateListaDePreciosProveedorFail
  | UpdateListaDePreciosProveedorSuccess
  | DeleteListaDePreciosProveedor
  | DeleteListaDePreciosProveedorFail
  | DeleteListaDePreciosProveedorSuccess
  | AplicarListaProveedor
  | AplicarListaProveedorFail
  | AplicarListaProveedorSuccess
  | ActualizarComprasConLista
  | ActualizarComprasConListaFail
  | ActualizarComprasConListaSuccess;
