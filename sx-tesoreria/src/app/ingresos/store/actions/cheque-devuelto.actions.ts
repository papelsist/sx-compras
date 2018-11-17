import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ChequeDevuelto } from 'app/ingresos/models/cheque-devuelto';
import { PeriodoFilter } from 'app/models';

export enum ChequeDevueltoActionTypes {
  SetChequeDevueltosFilter = '[ChequeDevueltos Component ] Set ChequeDevueltos filter',
  SetChequeDevueltosSearchTerm = '[ChequeDevueltos Component] Set ChequeDevueltos term',

  LoadChequeDevueltos = '[ChequeDevueltos Guard] Load ChequeDevueltos',
  LoadChequeDevueltosSuccess = '[ChequeDevuelto API] Load ChequeDevueltos Success',

  CreateChequeDevuelto = '[ChequeDevuelto Component] Create ChequeDevuelto',
  CreateChequeDevueltoSuccess = '[ChequeDevuelto API] Create ChequeDevuelto Success',

  DeleteChequeDevuelto = '[ChequeDevuelto Component] Delete ChequeDevuelto',
  DeleteChequeDevueltoSuccess = '[ChequeDevuelto API] Delete ChequeDevuelto Success',

  ChequeDevueltosFail = '[ChequeDevuelto API] ChequeDevueltos fail'
}

export class SetChequeDevueltosFilter implements Action {
  readonly type = ChequeDevueltoActionTypes.SetChequeDevueltosFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

export class SetChequeDevueltosSearchTerm implements Action {
  readonly type = ChequeDevueltoActionTypes.SetChequeDevueltosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadChequeDevueltos implements Action {
  readonly type = ChequeDevueltoActionTypes.LoadChequeDevueltos;
}

export class LoadChequeDevueltosSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.LoadChequeDevueltosSuccess;

  constructor(public payload: { cheques: ChequeDevuelto[] }) {}
}

export class CreateChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.CreateChequeDevuelto;
  constructor(public payload: { cheque: ChequeDevuelto }) {}
}

export class CreateChequeDevueltoSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.CreateChequeDevueltoSuccess;
  constructor(public payload: { cheque: ChequeDevuelto }) {}
}

export class DeleteChequeDevuelto implements Action {
  readonly type = ChequeDevueltoActionTypes.DeleteChequeDevuelto;

  constructor(public payload: { cheque: ChequeDevuelto }) {}
}

export class DeleteChequeDevueltoSuccess implements Action {
  readonly type = ChequeDevueltoActionTypes.DeleteChequeDevueltoSuccess;

  constructor(public payload: { cheque: ChequeDevuelto }) {}
}

export class ChequeDevueltosFail implements Action {
  readonly type = ChequeDevueltoActionTypes.ChequeDevueltosFail;
  constructor(public payload: { response: any }) {}
}

export type ChequeDevueltoActions =
  | SetChequeDevueltosFilter
  | SetChequeDevueltosSearchTerm
  | LoadChequeDevueltos
  | LoadChequeDevueltosSuccess
  | CreateChequeDevuelto
  | CreateChequeDevueltoSuccess
  | DeleteChequeDevuelto
  | DeleteChequeDevueltoSuccess
  | ChequeDevueltosFail;
