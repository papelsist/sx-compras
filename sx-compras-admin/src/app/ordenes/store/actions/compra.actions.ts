import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Compra } from '../../models/compra';

export enum CompraActionTypes {
  LoadCompras = '[Compra] Load Compras',
  AddCompra = '[Compra] Add Compra',
  UpsertCompra = '[Compra] Upsert Compra',
  AddCompras = '[Compra] Add Compras',
  UpsertCompras = '[Compra] Upsert Compras',
  UpdateCompra = '[Compra] Update Compra',
  UpdateCompras = '[Compra] Update Compras',
  DeleteCompra = '[Compra] Delete Compra',
  DeleteCompras = '[Compra] Delete Compras',
  ClearCompras = '[Compra] Clear Compras'
}

export class LoadCompras implements Action {
  readonly type = CompraActionTypes.LoadCompras;

  constructor(public payload: { compras: Compra[] }) {}
}

export class AddCompra implements Action {
  readonly type = CompraActionTypes.AddCompra;

  constructor(public payload: { compra: Compra }) {}
}

export class UpsertCompra implements Action {
  readonly type = CompraActionTypes.UpsertCompra;

  constructor(public payload: { compra: Compra }) {}
}

export class AddCompras implements Action {
  readonly type = CompraActionTypes.AddCompras;

  constructor(public payload: { compras: Compra[] }) {}
}

export class UpsertCompras implements Action {
  readonly type = CompraActionTypes.UpsertCompras;

  constructor(public payload: { compras: Compra[] }) {}
}

export class UpdateCompra implements Action {
  readonly type = CompraActionTypes.UpdateCompra;

  constructor(public payload: { compra: Update<Compra> }) {}
}

export class UpdateCompras implements Action {
  readonly type = CompraActionTypes.UpdateCompras;

  constructor(public payload: { compras: Update<Compra>[] }) {}
}

export class DeleteCompra implements Action {
  readonly type = CompraActionTypes.DeleteCompra;

  constructor(public payload: { id: string }) {}
}

export class DeleteCompras implements Action {
  readonly type = CompraActionTypes.DeleteCompras;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearCompras implements Action {
  readonly type = CompraActionTypes.ClearCompras;
}

export type CompraActions =
  | LoadCompras
  | AddCompra
  | UpsertCompra
  | AddCompras
  | UpsertCompras
  | UpdateCompra
  | UpdateCompras
  | DeleteCompra
  | DeleteCompras
  | ClearCompras;
