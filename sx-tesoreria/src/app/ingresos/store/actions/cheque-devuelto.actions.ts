import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ChequeDevuelto } from 'app/ingresos/models/cheque-devuelto';

export enum ChequeDevueltoActionTypes {
  SetChequeDevueltosFilter = '[ChequeDevueltos Component ] Set ChequeDevueltos filter',
  SetChequeDevueltosSearchTerm = '[ChequeDevueltos Component] Set ChequeDevueltos term',
  LoadChequeDevueltos = '[ChequeDevueltos Guard] Load ChequeDevueltos',
  LoadChequeDevueltosFail = '[ChequeDevuelto API] Load ChequeDevueltos fail',
  LoadChequeDevueltosSuccess = '[ChequeDevuelto API] Load ChequeDevueltos Success',
  CreateChequeDevuelto = '[ChequeDevuelto Component] Create ChequeDevuelto',
  CreateChequeDevueltoFail = '[ChequeDevuelto API] Create ChequeDevuelto Fail',
  CreateChequeDevueltoSuccess = '[ChequeDevuelto API] Create ChequeDevuelto Success',
  UpsertChequeDevuelto = '[ChequeDevuelto Guard] Upsert ChequeDevuelto',
  UpdateChequeDevuelto = '[ChequeDevuelto Component] Update ChequeDevuelto',
  UpdateChequeDevueltoFail = '[ChequeDevuelto API] Update ChequeDevuelto Fail',
  UpdateChequeDevueltoSuccess = '[ChequeDevuelto API] Update ChequeDevuelto Success',
  DeleteChequeDevuelto = '[ChequeDevuelto Component] Delete ChequeDevuelto',
  DeleteChequeDevueltoFail = '[ChequeDevuelto API] Delete ChequeDevuelto Fail',
  DeleteChequeDevueltoSuccess = '[ChequeDevuelto API] Delete ChequeDevuelto Success',
  DevolverCheque = '[ChequeDevuelto Component] DevolverCheque',
  DevolverChequeFail = '[ChequeDevuelto API] DevolverCheque Fail',
  DevolverChequeSuccess = '[ChequeDevuelto API] DevolverCheque Success'
}

export class SetChequeDevueltosFilter implements Action {
  readonly type = ChequeDevueltoActionTypes.SetChequeDevueltosFilter;
  constructor(public payload: { filter: ChequeDevueltosFilter }) {}
}

export class SetChequeDevueltosSearchTerm implements Action {
  readonly type = ChequeDevueltoActionTypes.SetChequeDevueltosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadChequeDevueltos implements Action {
  readonly type = ChequeDevueltoActionTypes.LoadChequeDevueltos;
}
export class LoadChequeDevueltosFail implements Action {
  readonly type = ChequeDevueltoActionTypes.LoadChequeDevueltosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadChequeDevueltosSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.LoadChequeDevueltosSuccess;

  constructor(public payload: { cobros: ChequeDevuelto[] }) {}
}

export class CreateChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.CreateChequeDevuelto;
  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export class CreateChequeDevueltoFail implements Action {
  readonly type = ChequeDevueltoActionTypes.CreateChequeDevueltoFail;
  constructor(public payload: { response: any }) {}
}

export class CreateChequeDevueltoSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.CreateChequeDevueltoSuccess;
  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export class UpdateChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.UpdateChequeDevuelto;

  constructor(public payload: { cobro: Update<ChequeDevuelto> }) {}
}
export class UpdateChequeDevueltoFail implements Action {
  readonly type = ChequeDevueltoActionTypes.UpdateChequeDevueltoFail;

  constructor(public payload: { response: any }) {}
}
export class UpdateChequeDevueltoSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.UpdateChequeDevueltoSuccess;

  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export class UpsertChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.UpsertChequeDevuelto;

  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export class DeleteChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.DeleteChequeDevuelto;

  constructor(public payload: { cobro: ChequeDevuelto }) {}
}
export class DeleteChequeDevueltoFail implements Action {
  readonly type = ChequeDevueltoActionTypes.DeleteChequeDevueltoFail;

  constructor(public payload: { response: any }) {}
}
export class DeleteChequeDevueltoSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.DeleteChequeDevueltoSuccess;

  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export class DevolverCheque implements Action {
  readonly type = ChequeDevueltoActionTypes.DevolverCheque;

  constructor(public payload: { cobro: ChequeDevuelto; fecha: Date }) {}
}
export class DevolverChequeFail implements Action {
  readonly type = ChequeDevueltoActionTypes.DevolverChequeFail;

  constructor(public payload: { response: any }) {}
}
export class DevolverChequeSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.DevolverChequeSuccess;

  constructor(public payload: { cobro: ChequeDevuelto }) {}
}

export type ChequeDevueltoActions =
  | SetChequeDevueltosFilter
  | SetChequeDevueltosSearchTerm
  | LoadChequeDevueltos
  | LoadChequeDevueltosFail
  | LoadChequeDevueltosSuccess
  | CreateChequeDevuelto
  | CreateChequeDevueltoFail
  | CreateChequeDevueltoSuccess
  | UpdateChequeDevuelto
  | UpdateChequeDevueltoFail
  | UpdateChequeDevueltoSuccess
  | UpsertChequeDevuelto
  | DeleteChequeDevuelto
  | DeleteChequeDevueltoFail
  | DeleteChequeDevueltoSuccess
  | DevolverCheque
  | DevolverChequeFail
  | DevolverChequeSuccess;
