import { Action } from '@ngrx/store';

import { Comision } from '../../models';
import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

export enum ComisionActionTypes {
  SetComisionesFilter = '[Comision Component ] Set Comisiones filter',

  LoadComisiones = '[ComisionesDeTesoreria Guard] Load Comisiones',
  LoadComisionesSuccess = '[Comision API] Load Comisiones Success',

  CreateComision = '[Comision Component] Create Comision',
  CreateComisionSuccess = '[Comision API] Create Comision Success',

  UpdateComision = '[Comision Component] Update Comision',
  UpdateComisionSuccess = '[Comision API] Update Comision Success',

  DeleteComision = '[Comision Component] Delete Comision',
  DeleteComisionSuccess = '[Comision API] Delete Comision Success',

  UpsertComision = '[Comision exists guard] Upser existing comision',
  ComisionError = '[Comision API] Comision Http Error'
}

// Filters
export class SetComisionesFilter implements Action {
  readonly type = ComisionActionTypes.SetComisionesFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

// Load
export class LoadComisiones implements Action {
  readonly type = ComisionActionTypes.LoadComisiones;
}
export class LoadComisionesSuccess implements Action {
  readonly type = ComisionActionTypes.LoadComisionesSuccess;

  constructor(public payload: { comisiones: Comision[] }) {}
}

// Create
export class CreateComision implements Action {
  readonly type = ComisionActionTypes.CreateComision;

  constructor(public payload: { comision: Comision }) {}
}
export class CreateComisionSuccess implements Action {
  readonly type = ComisionActionTypes.CreateComisionSuccess;

  constructor(public payload: { comision: Comision }) {}
}
// Delete
export class DeleteComision implements Action {
  readonly type = ComisionActionTypes.DeleteComision;

  constructor(public payload: { comision: Comision }) {}
}
export class DeleteComisionSuccess implements Action {
  readonly type = ComisionActionTypes.DeleteComisionSuccess;

  constructor(public payload: { comision: Comision }) {}
}
// Update
export class UpdateComision implements Action {
  readonly type = ComisionActionTypes.UpdateComision;

  constructor(public payload: { update: Update<Comision> }) {}
}
export class UpdateComisionSuccess implements Action {
  readonly type = ComisionActionTypes.UpdateComisionSuccess;

  constructor(public payload: { comision: Comision }) {}
}

// Upsert
export class UpsertComision implements Action {
  readonly type = ComisionActionTypes.UpsertComision;
  constructor(public payload: { comision: Comision }) {}
}

// Errors
export class ComisionError implements Action {
  readonly type = ComisionActionTypes.ComisionError;
  constructor(public payload: { response: any }) {}
}

export type ComisionActions =
  | SetComisionesFilter
  | LoadComisiones
  | LoadComisionesSuccess
  | CreateComision
  | CreateComisionSuccess
  | DeleteComision
  | DeleteComisionSuccess
  | UpdateComision
  | UpdateComisionSuccess
  | ComisionError
  | UpsertComision;
