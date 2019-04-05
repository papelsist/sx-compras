import { Action } from '@ngrx/store';

import { Cobro, CobrosFilter } from '../models';

export enum CobroActionTypes {
  SetCobrosFilter = '[Cobros Component ] Set Cobros filter',
  SetCobrosSearchTerm = '[Cobros Component] Set Cobros term',
  LoadCobros = '[Cobros Guard] Load Cobros',
  LoadCobrosFail = '[Cobro API] Load Cobros fail',
  LoadCobrosSuccess = '[Cobro API] Load Cobros Success'
}

export class SetCobrosFilter implements Action {
  readonly type = CobroActionTypes.SetCobrosFilter;
  constructor(public payload: { filter: CobrosFilter }) {}
}

export class SetCobrosSearchTerm implements Action {
  readonly type = CobroActionTypes.SetCobrosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadCobros implements Action {
  readonly type = CobroActionTypes.LoadCobros;
}
export class LoadCobrosFail implements Action {
  readonly type = CobroActionTypes.LoadCobrosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCobrosSuccess implements Action {
  readonly type = CobroActionTypes.LoadCobrosSuccess;

  constructor(public payload: { cobros: Cobro[] }) {}
}

export type CobroActions =
  | SetCobrosFilter
  | SetCobrosSearchTerm
  | LoadCobros
  | LoadCobrosFail
  | LoadCobrosSuccess;
