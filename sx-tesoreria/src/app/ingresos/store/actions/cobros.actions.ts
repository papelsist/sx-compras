import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Cobro, CobrosFilter } from 'app/ingresos/models/cobro';

export enum CobroActionTypes {
  SetCobrosFilter = '[Cobros Component ] Set Cobros filter',
  SetCobrosSearchTerm = '[Cobros Component] Set Cobros term',
  LoadCobros = '[Cobros Guard] Load Cobros',
  LoadCobrosFail = '[Cobro API] Load Cobros fail',
  LoadCobrosSuccess = '[Cobro API] Load Cobros Success',
  UpsertCobro = '[Cobro Guard] Upsert Cobro',
  UpdateCobro = '[Cobro Component] Update Cobro',
  UpdateCobroFail = '[Cobro API] Update Cobro Fail',
  UpdateCobroSuccess = '[Cobro API] Update Cobro Success'
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

export class UpdateCobro implements Action {
  readonly type = CobroActionTypes.UpdateCobro;

  constructor(public payload: { cobro: Update<Cobro> }) {}
}
export class UpdateCobroFail implements Action {
  readonly type = CobroActionTypes.UpdateCobroFail;

  constructor(public payload: { response: any }) {}
}
export class UpdateCobroSuccess implements Action {
  readonly type = CobroActionTypes.UpdateCobroSuccess;

  constructor(public payload: { cobro: Cobro }) {}
}

export class UpsertCobro implements Action {
  readonly type = CobroActionTypes.UpsertCobro;

  constructor(public payload: { cobro: Cobro }) {}
}

export type CobroActions =
  | SetCobrosFilter
  | SetCobrosSearchTerm
  | LoadCobros
  | LoadCobrosFail
  | LoadCobrosSuccess
  | UpdateCobro
  | UpdateCobroFail
  | UpdateCobroSuccess
  | UpsertCobro;
