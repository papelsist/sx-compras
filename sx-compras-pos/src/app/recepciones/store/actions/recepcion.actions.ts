import { Action } from '@ngrx/store';

import { RecepcionDeCompra, ComsFilter } from '../../models/recepcionDeCompra';

export enum RecepcionDeCompraActionTypes {
  LoadComs = '[RecepcionDeCompra] Load Coms',
  LoadComsFail = '[RecepcionDeCompra] Load Coms fail',
  LoadComsSuccess = '[RecepcionDeCompra] Load Coms Success',

  AddRecepcionDeCompra = '[RecepcionDeCompra] Add RecepcionDeCompra',
  AddRecepcionDeCompraFail = '[RecepcionDeCompra] Add RecepcionDeCompra Fail',
  AddRecepcionDeCompraSuccess = '[RecepcionDeCompra] Add RecepcionDeCompra Success',

  UpsertRecepcionDeCompra = '[RecepcionDeCompra] Upsert RecepcionDeCompra',
  UpsertComs = '[RecepcionDeCompra] Upsert many Coms',
  UpdateRecepcionDeCompra = '[RecepcionDeCompra] Update RecepcionDeCompra',
  UpdateRecepcionDeCompraFail = '[RecepcionDeCompra] Update RecepcionDeCompra Fail',

  DeleteRecepcionDeCompra = '[RecepcionDeCompra] Delete RecepcionDeCompra',
  DeleteRecepcionDeCompraFail = '[RecepcionDeCompra] Delete RecepcionDeCompra Fail',
  DeleteRecepcionDeCompraSuccess = '[RecepcionDeCompra] Delete RecepcionDeCompra Success',
  ClearComs = '[RecepcionDeCompra] Clear Coms',

  GetRecepcionDeCompra = '[RecepcionDeCompra] Get One RecepcionDeCompra',
  GetRecepcionDeCompraFail = '[RecepcionDeCompra] Get One RecepcionDeCompra fail',
  GetRecepcionDeCompraSuccess = '[RecepcionDeCompra] Get One RecepcionDeCompra Success',
  SetSelectedComs = '[RecepcionDeCompra] Set Selected  Coms ',
  SetComsFilter = '[RecepcionDeCompra] Set COMS filter'
}

export class LoadComs implements Action {
  readonly type = RecepcionDeCompraActionTypes.LoadComs;
}
export class LoadComsFail implements Action {
  readonly type = RecepcionDeCompraActionTypes.LoadComsFail;
  constructor(public payload: any) {}
}
export class LoadComsSuccess implements Action {
  readonly type = RecepcionDeCompraActionTypes.LoadComsSuccess;

  constructor(public payload: RecepcionDeCompra[]) {}
}

export class AddRecepcionDeCompra implements Action {
  readonly type = RecepcionDeCompraActionTypes.AddRecepcionDeCompra;
  constructor(public payload: RecepcionDeCompra) {}
}
export class AddRecepcionDeCompraFail implements Action {
  readonly type = RecepcionDeCompraActionTypes.AddRecepcionDeCompraFail;

  constructor(public payload: any) {}
}
export class AddRecepcionDeCompraSuccess implements Action {
  readonly type = RecepcionDeCompraActionTypes.AddRecepcionDeCompraSuccess;

  constructor(public payload: RecepcionDeCompra) {}
}

export class UpdateRecepcionDeCompra implements Action {
  readonly type = RecepcionDeCompraActionTypes.UpdateRecepcionDeCompra;

  constructor(public payload: RecepcionDeCompra) {}
}
export class UpdateRecepcionDeCompraFail implements Action {
  readonly type = RecepcionDeCompraActionTypes.UpdateRecepcionDeCompraFail;

  constructor(public payload: any) {}
}

export class UpsertRecepcionDeCompra implements Action {
  readonly type = RecepcionDeCompraActionTypes.UpsertRecepcionDeCompra;

  constructor(public payload: { com: RecepcionDeCompra }) {}
}
export class UpsertComs implements Action {
  readonly type = RecepcionDeCompraActionTypes.UpsertComs;

  constructor(public payload: RecepcionDeCompra[]) {}
}

export class DeleteRecepcionDeCompra implements Action {
  readonly type = RecepcionDeCompraActionTypes.DeleteRecepcionDeCompra;

  constructor(public payload: RecepcionDeCompra) {}
}
export class DeleteRecepcionDeCompraFail implements Action {
  readonly type = RecepcionDeCompraActionTypes.DeleteRecepcionDeCompraFail;

  constructor(public payload: any) {}
}
export class DeleteRecepcionDeCompraSuccess implements Action {
  readonly type = RecepcionDeCompraActionTypes.DeleteRecepcionDeCompraSuccess;

  constructor(public payload: RecepcionDeCompra) {}
}

export class ClearComs implements Action {
  readonly type = RecepcionDeCompraActionTypes.ClearComs;
}

export class SetSelectedComs implements Action {
  readonly type = RecepcionDeCompraActionTypes.SetSelectedComs;
  constructor(public payload: { selected: string[] }) {}
}

export class GetRecepcionDeCompra implements Action {
  readonly type = RecepcionDeCompraActionTypes.GetRecepcionDeCompra;
  constructor(public payload: { id: string }) {}
}
export class GetRecepcionDeCompraFail implements Action {
  readonly type = RecepcionDeCompraActionTypes.GetRecepcionDeCompraFail;
  constructor(public payload: any) {}
}

export class GetRecepcionDeCompraSuccess implements Action {
  readonly type = RecepcionDeCompraActionTypes.GetRecepcionDeCompra;
  constructor(public payload: { RecepcionDeCompra: RecepcionDeCompra }) {}
}

export class SetComsFilter implements Action {
  readonly type = RecepcionDeCompraActionTypes.SetComsFilter;
  constructor(public payload: { filter: ComsFilter }) {}
}

export type RecepcionDeCompraActions =
  | LoadComs
  | LoadComsFail
  | LoadComsSuccess
  | AddRecepcionDeCompra
  | AddRecepcionDeCompraFail
  | AddRecepcionDeCompraSuccess
  | UpdateRecepcionDeCompra
  | UpdateRecepcionDeCompraFail
  | UpsertRecepcionDeCompra
  | UpsertComs
  | DeleteRecepcionDeCompra
  | DeleteRecepcionDeCompraFail
  | DeleteRecepcionDeCompraSuccess
  | ClearComs
  | SetSelectedComs
  | GetRecepcionDeCompra
  | GetRecepcionDeCompraFail
  | GetRecepcionDeCompraSuccess
  | SetComsFilter;
