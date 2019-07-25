import { Action } from '@ngrx/store';

import { Compra, ComprasFilter } from '../../models/compra';
import { Periodo } from 'app/_core/models/periodo';

export enum CompraActionTypes {
  SetPeriodo = '[Compras component]Set periodo',
  SetComprasFilter = '[Compra] Set Compras filter',
  SetComprasSearchTerm = '[Compra] Set Search Term',
  LoadCompras = '[Compra] Load Compras',
  LoadComprasFail = '[Compra] Load Compras fail',
  LoadComprasSuccess = '[Compra] Load Compras Success',
  AddCompra = '[Compra] Add Compra',
  AddCompraFail = '[Compra] Add Compra Fail',
  AddCompraSuccess = '[Compra] Add Compra Success',
  UpsertCompra = '[Compra] Upsert Compra',
  UpsertCompras = '[Compra] Upsert many Compras',
  UpdateCompra = '[Compra] Update Compra',
  UpdateCompraFail = '[Compra] Update Compra Fail',
  UpdateCompraSuccess = '[Compra] Update Compra Success',
  DeleteCompra = '[Compra] Delete Compra',
  DeleteCompraFail = '[Compra] Delete Compra Fail',
  DeleteCompraSuccess = '[Compra] Delete Compra Success',
  ClearCompras = '[Compra] Clear Compras',
  Load = '[Compra] Load One Compra',
  LoadFail = '[Compra] Load One Compra fail',
  LoadSuccess = '[Compra] Load One Compra Success',
  CerrarCompra = '[Compra] Cerrar  Compra ',
  DepurarCompra = '[Compra] Depurar  Compra ',
  // Actualizar precios
  ActualizarPrecios = '[Compra component] Actualizar precios de Compra',
  ActualizarPreciosFail = '[Compra] Actualizar precios de Compra Fail',
  ActualizarPreciosSuccess = '[Compra] Actualizar precios de Compra Success'
}

export class SetPeriodo implements Action {
  readonly type = CompraActionTypes.SetPeriodo;
  constructor(payload: { periodo: Periodo }) {}
}

export class LoadCompras implements Action {
  readonly type = CompraActionTypes.LoadCompras;
}
export class LoadComprasFail implements Action {
  readonly type = CompraActionTypes.LoadComprasFail;
  constructor(public payload: any) {}
}
export class LoadComprasSuccess implements Action {
  readonly type = CompraActionTypes.LoadComprasSuccess;

  constructor(public payload: Compra[]) {}
}

export class AddCompra implements Action {
  readonly type = CompraActionTypes.AddCompra;
  constructor(public payload: Compra) {}
}
export class AddCompraFail implements Action {
  readonly type = CompraActionTypes.AddCompraFail;

  constructor(public payload: any) {}
}
export class AddCompraSuccess implements Action {
  readonly type = CompraActionTypes.AddCompraSuccess;

  constructor(public payload: Compra) {}
}

export class UpdateCompra implements Action {
  readonly type = CompraActionTypes.UpdateCompra;

  constructor(public payload: Compra) {}
}
export class UpdateCompraFail implements Action {
  readonly type = CompraActionTypes.UpdateCompraFail;

  constructor(public payload: any) {}
}
export class UpdateCompraSuccess implements Action {
  readonly type = CompraActionTypes.UpdateCompraSuccess;

  constructor(public payload: Compra) {}
}

export class UpsertCompra implements Action {
  readonly type = CompraActionTypes.UpsertCompra;

  constructor(public payload: { compra: Compra }) {}
}
export class UpsertCompras implements Action {
  readonly type = CompraActionTypes.UpsertCompras;

  constructor(public payload: Compra[]) {}
}

export class DeleteCompra implements Action {
  readonly type = CompraActionTypes.DeleteCompra;

  constructor(public payload: Compra) {}
}
export class DeleteCompraFail implements Action {
  readonly type = CompraActionTypes.DeleteCompraFail;

  constructor(public payload: any) {}
}
export class DeleteCompraSuccess implements Action {
  readonly type = CompraActionTypes.DeleteCompraSuccess;

  constructor(public payload: Compra) {}
}

export class ClearCompras implements Action {
  readonly type = CompraActionTypes.ClearCompras;
}

export class SetComprasFilter implements Action {
  readonly type = CompraActionTypes.SetComprasFilter;
  constructor(public payload: { filter: ComprasFilter }) {}
}
export class SetComprasSearchTerm implements Action {
  readonly type = CompraActionTypes.SetComprasSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class CerrarCompra implements Action {
  readonly type = CompraActionTypes.CerrarCompra;

  constructor(public payload: Compra) {}
}
export class DepurarCompra implements Action {
  readonly type = CompraActionTypes.DepurarCompra;

  constructor(public payload: Compra) {}
}

// Actualizar precios
export class ActualizarPrecios implements Action {
  readonly type = CompraActionTypes.ActualizarPrecios;
  constructor(public payload: { compraId: string }) {}
}
export class ActualizarPreciosFail implements Action {
  readonly type = CompraActionTypes.ActualizarPreciosFail;
  constructor(public payload: { response: any }) {}
}
export class ActualizarPreciosSuccess implements Action {
  readonly type = CompraActionTypes.ActualizarPreciosSuccess;
  constructor(public payload: { compra: Compra }) {}
}

export type CompraActions =
  | SetPeriodo
  | LoadCompras
  | LoadComprasFail
  | LoadComprasSuccess
  | AddCompra
  | AddCompraFail
  | AddCompraSuccess
  | UpdateCompra
  | UpdateCompraFail
  | UpdateCompraSuccess
  | UpsertCompra
  | UpsertCompras
  | DeleteCompra
  | DeleteCompraFail
  | DeleteCompraSuccess
  | ClearCompras
  | SetComprasFilter
  | SetComprasSearchTerm
  | CerrarCompra
  | DepurarCompra
  //
  | ActualizarPrecios
  | ActualizarPreciosFail
  | ActualizarPreciosSuccess;
