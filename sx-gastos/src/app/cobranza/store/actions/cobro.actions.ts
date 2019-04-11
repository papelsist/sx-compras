import { Action } from '@ngrx/store';

import { Cobro, Cartera, CarteraFilter } from '../../models';

export enum CobroActionTypes {
  SetCobrosSearchTerm = '[Cobros Component] Set Cobros term',
  LoadCobros = '[Cobros Guard] Load Cobros',
  LoadCobrosFail = '[Cobro API] Load Cobros fail',
  LoadCobrosSuccess = '[Cobro API] Load Cobros Success',

  UpsertCobro = '[Cobro-Exists Guard] UpserCobro'
}

export class SetCobrosSearchTerm implements Action {
  readonly type = CobroActionTypes.SetCobrosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadCobros implements Action {
  readonly type = CobroActionTypes.LoadCobros;
  constructor(public payload: { cartera: Cartera; filter?: CarteraFilter }) {}
}
export class LoadCobrosFail implements Action {
  readonly type = CobroActionTypes.LoadCobrosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCobrosSuccess implements Action {
  readonly type = CobroActionTypes.LoadCobrosSuccess;

  constructor(public payload: { cobros: Cobro[] }) {}
}

export class UpsertCobro implements Action {
  readonly type = CobroActionTypes.UpsertCobro;
  constructor(public payload: { cobro: Cobro }) {}
}

export type CobroActions =
  | SetCobrosSearchTerm
  | LoadCobros
  | LoadCobrosFail
  | LoadCobrosSuccess
  | UpsertCobro;
