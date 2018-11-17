import { Action } from '@ngrx/store';

import { CompraMoneda } from '../../models';
import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

export enum CompraMonedaActionTypes {
  SetCompraMonedasFilter = '[CompraMoneda Component ] Set CompraMoneda monedas filter',

  LoadCompraMonedas = '[ComprasMonedaDeTesoreria Guard] Load ComprasMonedas',
  LoadCompraMonedasSuccess = '[CompraMoneda API] Load ComprasMonedas Success',

  CreateCompraMoneda = '[CompraMoneda Component] Create CompraMoneda',
  CreateCompraMonedaSuccess = '[CompraMoneda API] Create CompraMoneda Success',

  UpdateCompraMoneda = '[CompraMoneda Component] Update CompraMoneda',
  UpdateCompraMonedaSuccess = '[CompraMoneda API] Update CompraMoneda Success',

  DeleteCompraMoneda = '[CompraMoneda Component] Delete CompraMoneda',
  DeleteCompraMonedaSuccess = '[CompraMoneda API] Delete CompraMoneda Success',

  UpsertCompraMoneda = '[CompraMoneda exists guard] Upser existing compra',
  CompraMonedaError = '[CompraMoneda API] CompraMoneda Http Error'
}

// Filters
export class SetCompraMonedasFilter implements Action {
  readonly type = CompraMonedaActionTypes.SetCompraMonedasFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

// Load
export class LoadCompraMonedas implements Action {
  readonly type = CompraMonedaActionTypes.LoadCompraMonedas;
}
export class LoadCompraMonedasSuccess implements Action {
  readonly type = CompraMonedaActionTypes.LoadCompraMonedasSuccess;

  constructor(public payload: { compras: CompraMoneda[] }) {}
}

// Create
export class CreateCompraMoneda implements Action {
  readonly type = CompraMonedaActionTypes.CreateCompraMoneda;

  constructor(public payload: { compra: CompraMoneda }) {}
}
export class CreateCompraMonedaSuccess implements Action {
  readonly type = CompraMonedaActionTypes.CreateCompraMonedaSuccess;

  constructor(public payload: { compra: CompraMoneda }) {}
}
// Delete
export class DeleteCompraMoneda implements Action {
  readonly type = CompraMonedaActionTypes.DeleteCompraMoneda;

  constructor(public payload: { compra: CompraMoneda }) {}
}
export class DeleteCompraMonedaSuccess implements Action {
  readonly type = CompraMonedaActionTypes.DeleteCompraMonedaSuccess;

  constructor(public payload: { compra: CompraMoneda }) {}
}
// Update
export class UpdateCompraMoneda implements Action {
  readonly type = CompraMonedaActionTypes.UpdateCompraMoneda;

  constructor(public payload: { update: Update<CompraMoneda> }) {}
}
export class UpdateCompraMonedaSuccess implements Action {
  readonly type = CompraMonedaActionTypes.UpdateCompraMonedaSuccess;

  constructor(public payload: { compra: CompraMoneda }) {}
}

// Upsert
export class UpsertCompraMoneda implements Action {
  readonly type = CompraMonedaActionTypes.UpsertCompraMoneda;
  constructor(public payload: { compra: CompraMoneda }) {}
}

// Errors
export class CompraMonedaError implements Action {
  readonly type = CompraMonedaActionTypes.CompraMonedaError;
  constructor(public payload: { response: any }) {}
}

export type CompraMonedaActions =
  | SetCompraMonedasFilter
  | LoadCompraMonedas
  | LoadCompraMonedasSuccess
  | CreateCompraMoneda
  | CreateCompraMonedaSuccess
  | DeleteCompraMoneda
  | DeleteCompraMonedaSuccess
  | UpdateCompraMoneda
  | UpdateCompraMonedaSuccess
  | CompraMonedaError
  | UpsertCompraMoneda;
