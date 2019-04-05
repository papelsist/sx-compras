import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { FacturistaCargo } from 'app/control-de-embarques/model';

export enum CargosActionTypes {
  SetCargosFilter = '[Cargos Component ] Set Cargos filter',
  SetCargosSearchTerm = '[Cargos Component] Set Cargos search term',
  LoadCargos = '[Cargos Guard] Load Cargos',
  LoadCargosFail = '[Cargos API] Load Cargos fail',
  LoadCargosSuccess = '[Cargos API] Load Cargos Success',
  // Create
  CreateCargo = '[Cargos CargosComponent] Create cargos',
  CreateCargoFail = '[Cargos Effect API] Create cargos fail',
  CreateCargoSuccess = '[Cargos Effect API] Create cargos success',
  // Update
  UpdateCargo = '[Cargos CargosComponent] Update cargos',
  UpdateCargoFail = '[Cargos Effect API] Update cargos fail',
  UpdateCargoSuccess = '[Cargos Effect API] Update cargos success',
  // Delete
  DeleteCargo = '[Cargos CargosComponent] Delete cargos',
  DeleteCargoFail = '[Cargos Effect API] Delete cargos fail',
  DeleteCargoSuccess = '[Cargos Effect API] Delete cargos success'
}

export class SetCargosFilter implements Action {
  readonly type = CargosActionTypes.SetCargosFilter;
  constructor(public payload: { filter: { periodo: Periodo } }) {}
}
export class SetCargosSearchTerm implements Action {
  readonly type = CargosActionTypes.SetCargosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadCargos implements Action {
  readonly type = CargosActionTypes.LoadCargos;
  constructor(public payload: { filter: { periodo: Periodo } }) {}
}
export class LoadCargosFail implements Action {
  readonly type = CargosActionTypes.LoadCargosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCargosSuccess implements Action {
  readonly type = CargosActionTypes.LoadCargosSuccess;

  constructor(public payload: { cargos: FacturistaCargo[] }) {}
}

// Create
export class CreateCargo implements Action {
  readonly type = CargosActionTypes.CreateCargo;
  constructor(public payload: { cargo: FacturistaCargo }) {}
}
export class CreateCargoFail implements Action {
  readonly type = CargosActionTypes.CreateCargoFail;
  constructor(public payload: { response: any }) {}
}
export class CreateCargoSuccess implements Action {
  readonly type = CargosActionTypes.CreateCargoSuccess;
  constructor(public payload: { cargo: FacturistaCargo }) {}
}

// Update
export class UpdateCargo implements Action {
  readonly type = CargosActionTypes.UpdateCargo;
  constructor(public payload: { update: Update<FacturistaCargo> }) {}
}
export class UpdateCargoFail implements Action {
  readonly type = CargosActionTypes.UpdateCargoFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateCargoSuccess implements Action {
  readonly type = CargosActionTypes.UpdateCargoSuccess;
  constructor(public payload: { cargo: FacturistaCargo }) {}
}

// Delete
export class DeleteCargo implements Action {
  readonly type = CargosActionTypes.DeleteCargo;
  constructor(public payload: { cargo: FacturistaCargo }) {}
}
export class DeleteCargoFail implements Action {
  readonly type = CargosActionTypes.DeleteCargoFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteCargoSuccess implements Action {
  readonly type = CargosActionTypes.DeleteCargoSuccess;
  constructor(public payload: { cargo: FacturistaCargo }) {}
}

export type CargosActions =
  | SetCargosFilter
  | SetCargosSearchTerm
  | LoadCargos
  | LoadCargosFail
  | LoadCargosSuccess
  | CreateCargo
  | CreateCargoFail
  | CreateCargoSuccess
  | UpdateCargo
  | UpdateCargoFail
  | UpdateCargoSuccess
  | DeleteCargo
  | DeleteCargoFail
  | DeleteCargoSuccess;
