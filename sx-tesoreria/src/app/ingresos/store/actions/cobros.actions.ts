import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Cobro, CobrosFilter } from 'app/ingresos/models/cobro';

export enum CobroActionTypes {
  SetCobrosFilter = '[Cobros Component ] Set Cobros filter',
  SetCobrosSearchTerm = '[Cobros Component] Set Cobros term',
  LoadCobros = '[Cobros Guard] Load Cobros',
  LoadCobrosFail = '[Cobro API] Load Cobros fail',
  LoadCobrosSuccess = '[Cobro API] Load Cobros Success',
  CreateCobro = '[Cobro Component] Create Cobro',
  CreateCobroFail = '[Cobro API] Create Cobro Fail',
  CreateCobroSuccess = '[Cobro API] Create Cobro Success',
  UpsertCobro = '[Cobro Guard] Upsert Cobro',
  UpdateCobro = '[Cobro Component] Update Cobro',
  UpdateCobroFail = '[Cobro API] Update Cobro Fail',
  UpdateCobroSuccess = '[Cobro API] Update Cobro Success',
  DeleteCobro = '[Cobro Component] Delete Cobro',
  DeleteCobroFail = '[Cobro API] Delete Cobro Fail',
  DeleteCobroSuccess = '[Cobro API] Delete Cobro Success',
  DevolverCheque = '[Cobro Component] DevolverCheque',
  DevolverChequeFail = '[Cobro API] DevolverCheque Fail',
  DevolverChequeSuccess = '[Cobro API] DevolverCheque Success'
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

export class CreateCobro implements Action {
  readonly type = CobroActionTypes.CreateCobro;
  constructor(public payload: { cobro: Cobro }) {}
}

export class CreateCobroFail implements Action {
  readonly type = CobroActionTypes.CreateCobroFail;
  constructor(public payload: { response: any }) {}
}

export class CreateCobroSuccess implements Action {
  readonly type = CobroActionTypes.CreateCobroSuccess;
  constructor(public payload: { cobro: Cobro }) {}
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

export class DeleteCobro implements Action {
  readonly type = CobroActionTypes.DeleteCobro;

  constructor(public payload: { cobro: Cobro }) {}
}
export class DeleteCobroFail implements Action {
  readonly type = CobroActionTypes.DeleteCobroFail;

  constructor(public payload: { response: any }) {}
}
export class DeleteCobroSuccess implements Action {
  readonly type = CobroActionTypes.DeleteCobroSuccess;

  constructor(public payload: { cobro: Cobro }) {}
}

export class DevolverCheque implements Action {
  readonly type = CobroActionTypes.DevolverCheque;

  constructor(public payload: { cobro: Cobro; fecha: Date }) {}
}
export class DevolverChequeFail implements Action {
  readonly type = CobroActionTypes.DevolverChequeFail;

  constructor(public payload: { response: any }) {}
}
export class DevolverChequeSuccess implements Action {
  readonly type = CobroActionTypes.DevolverChequeSuccess;

  constructor(public payload: { cobro: Cobro }) {}
}

export type CobroActions =
  | SetCobrosFilter
  | SetCobrosSearchTerm
  | LoadCobros
  | LoadCobrosFail
  | LoadCobrosSuccess
  | CreateCobro
  | CreateCobroFail
  | CreateCobroSuccess
  | UpdateCobro
  | UpdateCobroFail
  | UpdateCobroSuccess
  | UpsertCobro
  | DeleteCobro
  | DeleteCobroFail
  | DeleteCobroSuccess
  | DevolverCheque
  | DevolverChequeFail
  | DevolverChequeSuccess;
