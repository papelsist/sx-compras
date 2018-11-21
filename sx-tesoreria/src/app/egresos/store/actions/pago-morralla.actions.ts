import { Action } from '@ngrx/store';

import { PagoDeMorralla } from '../../models';
import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

export enum PagoDeMorrallaActionTypes {
  SetPagoDeMorrallasFilter = '[PagoDeMorralla Component ] Set PagoDeMorralla monedas filter',

  LoadPagoDeMorrallas = '[PagoMorrallas Guard] Load PagoMorrallas',
  LoadPagoDeMorrallasSuccess = '[PagoDeMorralla API] Load PagoMorrallas Success',

  CreatePagarMorralla = '[PagoDeMorralla Component] Pago de morralla create',
  CreatePagarMorrallaSuccess = '[PagoDeMorralla API] Pago de morralla create  Success',

  DeletePagoDeMorralla = '[PagoDeMorralla Component] Delete PagoDeMorralla',
  DeletePagoDeMorrallaSuccess = '[PagoDeMorralla API] Delete PagoDeMorralla Success',

  UpsertPagoDeMorralla = '[PagoDeMorralla exists guard] Upsert PagoDeMorralla',

  PagoDeMorrallaError = '[PagoDeMorralla API] PagoDeMorralla Http Error'
}

// Filters
export class SetPagoDeMorrallasFilter implements Action {
  readonly type = PagoDeMorrallaActionTypes.SetPagoDeMorrallasFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

// Load
export class LoadPagoDeMorrallas implements Action {
  readonly type = PagoDeMorrallaActionTypes.LoadPagoDeMorrallas;
}
export class LoadPagoDeMorrallasSuccess implements Action {
  readonly type = PagoDeMorrallaActionTypes.LoadPagoDeMorrallasSuccess;

  constructor(public payload: { pagos: PagoDeMorralla[] }) {}
}

// Pagar
export class CreatePagarMorralla implements Action {
  readonly type = PagoDeMorrallaActionTypes.CreatePagarMorralla;
  constructor(public payload: { pago: PagoDeMorralla }) {}
}
export class CreatePagarMorrallaSuccess implements Action {
  readonly type = PagoDeMorrallaActionTypes.CreatePagarMorrallaSuccess;
  constructor(public payload: { pago: PagoDeMorralla }) {}
}

// Delete
export class DeletePagoDeMorralla implements Action {
  readonly type = PagoDeMorrallaActionTypes.DeletePagoDeMorralla;

  constructor(public payload: { pago: PagoDeMorralla }) {}
}
export class DeletePagoDeMorrallaSuccess implements Action {
  readonly type = PagoDeMorrallaActionTypes.DeletePagoDeMorrallaSuccess;

  constructor(public payload: { pago: PagoDeMorralla }) {}
}

// Errors
export class PagoDeMorrallaError implements Action {
  readonly type = PagoDeMorrallaActionTypes.PagoDeMorrallaError;
  constructor(public payload: { response: any }) {}
}

export class UpsertPagoDeMorralla implements Action {
  readonly type = PagoDeMorrallaActionTypes.UpsertPagoDeMorralla;
  constructor(public payload: { pago: PagoDeMorralla }) {}
}

export type PagoDeMorrallaActions =
  | SetPagoDeMorrallasFilter
  | LoadPagoDeMorrallas
  | LoadPagoDeMorrallasSuccess
  | CreatePagarMorralla
  | CreatePagarMorrallaSuccess
  | DeletePagoDeMorralla
  | DeletePagoDeMorrallaSuccess
  | PagoDeMorrallaError
  | UpsertPagoDeMorralla;
