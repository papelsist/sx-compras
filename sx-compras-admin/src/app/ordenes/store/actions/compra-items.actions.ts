import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { CompraDet } from 'app/ordenes/models/compraDet';

export enum CompraDetActionTypes {
  LoadPartidas = '[CompraDet guard] Load Partidas de compra',
  LoadPartidasFail = '[CompraDet API] Load Partidas de compra fail',
  LoadPartidasSuccess = '[CompraDet API] Load Partidas de compra success',
  // Add
  AddCompraItem = '[Compra component] Add compra item',
  AddCompraItemFail = '[CompraDet API] Add compra item fail',
  AddCompraItemSuccess = '[CompraDet API] Add compra item success',
  // Delete
  DeleteCompraItem = '[Compra component] Delete compra item',
  DeleteCompraItemFail = '[CompraDet API] Delete compra item fail',
  DeleteCompraItemSuccess = '[CompraDet API] Delete compra item success',
  // Update
  UpdateCompraItem = '[Compra component] Update compra item',
  UpdateCompraItemFail = '[CompraDet API] Update compra item fail',
  UpdateCompraItemSuccess = '[CompraDet API] Update compra item success'
}

export class LoadPartidas implements Action {
  readonly type = CompraDetActionTypes.LoadPartidas;
  constructor(public payload: { compraId: string }) {}
}
export class LoadPartidasFail implements Action {
  readonly type = CompraDetActionTypes.LoadPartidasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadPartidasSuccess implements Action {
  readonly type = CompraDetActionTypes.LoadPartidasSuccess;
  constructor(public payload: { partidas: CompraDet[] }) {}
}
// Add
export class AddCompraItem implements Action {
  readonly type = CompraDetActionTypes.AddCompraItem;
  constructor(public payload: { item: CompraDet }) {}
}
export class AddCompraItemFail implements Action {
  readonly type = CompraDetActionTypes.AddCompraItemFail;
  constructor(public payload: { response: any }) {}
}
export class AddCompraItemSuccess implements Action {
  readonly type = CompraDetActionTypes.AddCompraItemSuccess;
  constructor(public payload: { item: CompraDet }) {}
}
// Delete
export class DeleteCompraItem implements Action {
  readonly type = CompraDetActionTypes.DeleteCompraItem;
  constructor(public payload: { item: CompraDet }) {}
}
export class DeleteCompraItemFail implements Action {
  readonly type = CompraDetActionTypes.DeleteCompraItemFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteCompraItemSuccess implements Action {
  readonly type = CompraDetActionTypes.DeleteCompraItemSuccess;
  constructor(public payload: { item: CompraDet }) {}
}

// Update
export class UpdateCompraItem implements Action {
  readonly type = CompraDetActionTypes.UpdateCompraItem;
  constructor(public payload: { item: Update<CompraDet> }) {}
}
export class UpdateCompraItemFail implements Action {
  readonly type = CompraDetActionTypes.UpdateCompraItemFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateCompraItemSuccess implements Action {
  readonly type = CompraDetActionTypes.UpdateCompraItemSuccess;
  constructor(public payload: { item: CompraDet }) {}
}

export type CompraDetActions =
  | LoadPartidas
  | LoadPartidasFail
  | LoadPartidasSuccess
  | AddCompraItem
  | AddCompraItemFail
  | AddCompraItemSuccess
  | DeleteCompraItem
  | DeleteCompraItemFail
  | DeleteCompraItemSuccess
  | UpdateCompraItem
  | UpdateCompraItemFail
  | UpdateCompraItemSuccess;
