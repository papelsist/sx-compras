import { Action } from '@ngrx/store';

import { Inversion } from '../../models/inversion';
import { TraspasosFilter } from '../../models/traspaso';
import { Update } from '@ngrx/entity';

export enum InversionActionTypes {
  SetInversionesFilter = '[Inversiones Component ] Set Inversiones filter',
  SetInversionesSearchTerm = '[Inversiones Component] Set Inversiones term',

  LoadInversiones = '[Inversiones Guard] Load Inversiones',
  LoadInversionesSuccess = '[Inversion API] Load Inversiones Success',

  CreateInversion = '[Inversion Component] Create Inversion',
  CreateInversionSuccess = '[Inversion API] Create Inversion Success',

  UpdateInversion = '[Inversion Component] Update Inversion',
  UpdateInversionSuccess = '[Inversion API] Update Inversion Success',

  DeleteInversion = '[Inversion Component] Delete Inversion',
  DeleteInversionSuccess = '[Inversion API] Delete Inversion Success',

  UpsertInversion = '[Inversion exists guard] Upser existing inversion',
  InversionError = '[Inversion API] Inversion Http Error'
}

// Filters
export class SetInversionesFilter implements Action {
  readonly type = InversionActionTypes.SetInversionesFilter;
  constructor(public payload: { filter: TraspasosFilter }) {}
}
export class SetInversionesSearchTerm implements Action {
  readonly type = InversionActionTypes.SetInversionesSearchTerm;
  constructor(public payload: { term: string }) {}
}

// Load
export class LoadInversiones implements Action {
  readonly type = InversionActionTypes.LoadInversiones;
}
export class LoadInversionesSuccess implements Action {
  readonly type = InversionActionTypes.LoadInversionesSuccess;

  constructor(public payload: { inversiones: Inversion[] }) {}
}

// Create
export class CreateInversion implements Action {
  readonly type = InversionActionTypes.CreateInversion;

  constructor(public payload: { inversion: Inversion }) {}
}
export class CreateInversionSuccess implements Action {
  readonly type = InversionActionTypes.CreateInversionSuccess;

  constructor(public payload: { inversion: Inversion }) {}
}
// Delete
export class DeleteInversion implements Action {
  readonly type = InversionActionTypes.DeleteInversion;

  constructor(public payload: { inversion: Inversion }) {}
}
export class DeleteInversionSuccess implements Action {
  readonly type = InversionActionTypes.DeleteInversionSuccess;

  constructor(public payload: { inversion: Inversion }) {}
}
// Update
export class UpdateInversion implements Action {
  readonly type = InversionActionTypes.UpdateInversion;

  constructor(public payload: { update: Update<Inversion> }) {}
}
export class UpdateInversionSuccess implements Action {
  readonly type = InversionActionTypes.UpdateInversionSuccess;

  constructor(public payload: { inversion: Inversion }) {}
}

// Upsert
export class UpsertInversion implements Action {
  readonly type = InversionActionTypes.UpsertInversion;
  constructor(public payload: { inversion: Inversion }) {}
}

// Errors
export class InversionError implements Action {
  readonly type = InversionActionTypes.InversionError;
  constructor(public payload: { response: any }) {}
}

export type InversionActions =
  | SetInversionesFilter
  | SetInversionesSearchTerm
  | LoadInversiones
  | LoadInversionesSuccess
  | CreateInversion
  | CreateInversionSuccess
  | DeleteInversion
  | DeleteInversionSuccess
  | UpdateInversion
  | UpdateInversionSuccess
  | InversionError
  | UpsertInversion;
