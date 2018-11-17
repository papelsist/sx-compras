import { Action } from '@ngrx/store';

import { Traspaso, TraspasosFilter } from '../../models/traspaso';
import { Update } from '@ngrx/entity';

export enum TraspasoActionTypes {
  SetTraspasosFilter = '[Traspasos Component ] Set Traspasos filter',
  SetTraspasosSearchTerm = '[Traspasos Component] Set Traspasos term',

  LoadTraspasos = '[Traspasos Guard] Load Traspasos',
  LoadTraspasosSuccess = '[Traspaso API] Load Traspasos Success',

  CreateTraspaso = '[Traspaso Component] Create Traspaso',
  CreateTraspasoSuccess = '[Traspaso API] Create Traspaso Success',

  UpdateTraspaso = '[Traspaso Component] Update Traspaso',
  UpdateTraspasoSuccess = '[Traspaso API] Update Traspaso Success',

  DeleteTraspaso = '[Traspaso Component] Delete Traspaso',
  DeleteTraspasoSuccess = '[Traspaso API] Delete Traspaso Success',

  UpsertTraspaso = '[Traspaso exists guard] Upser existing traspaso',
  TraspasoError = '[Traspaso API] Traspaso Http Error'
}

// Filters
export class SetTraspasosFilter implements Action {
  readonly type = TraspasoActionTypes.SetTraspasosFilter;
  constructor(public payload: { filter: TraspasosFilter }) {}
}
export class SetTraspasosSearchTerm implements Action {
  readonly type = TraspasoActionTypes.SetTraspasosSearchTerm;
  constructor(public payload: { term: string }) {}
}

// Load
export class LoadTraspasos implements Action {
  readonly type = TraspasoActionTypes.LoadTraspasos;
}
export class LoadTraspasosSuccess implements Action {
  readonly type = TraspasoActionTypes.LoadTraspasosSuccess;

  constructor(public payload: { traspasos: Traspaso[] }) {}
}

// Create
export class CreateTraspaso implements Action {
  readonly type = TraspasoActionTypes.CreateTraspaso;

  constructor(public payload: { traspaso: Traspaso }) {}
}
export class CreateTraspasoSuccess implements Action {
  readonly type = TraspasoActionTypes.CreateTraspasoSuccess;

  constructor(public payload: { traspaso: Traspaso }) {}
}
// Delete
export class DeleteTraspaso implements Action {
  readonly type = TraspasoActionTypes.DeleteTraspaso;

  constructor(public payload: { traspaso: Traspaso }) {}
}
export class DeleteTraspasoSuccess implements Action {
  readonly type = TraspasoActionTypes.DeleteTraspasoSuccess;

  constructor(public payload: { traspaso: Traspaso }) {}
}
// Update
export class UpdateTraspaso implements Action {
  readonly type = TraspasoActionTypes.UpdateTraspaso;

  constructor(public payload: { update: Update<Traspaso> }) {}
}
export class UpdateTraspasoSuccess implements Action {
  readonly type = TraspasoActionTypes.UpdateTraspasoSuccess;

  constructor(public payload: { traspaso: Traspaso }) {}
}

// Upsert
export class UpsertTraspaso implements Action {
  readonly type = TraspasoActionTypes.UpsertTraspaso;
  constructor(public payload: { traspaso: Traspaso }) {}
}

// Errors
export class TraspasoError implements Action {
  readonly type = TraspasoActionTypes.TraspasoError;
  constructor(public payload: { response: any }) {}
}

export type TraspasoActions =
  | SetTraspasosFilter
  | SetTraspasosSearchTerm
  | LoadTraspasos
  | LoadTraspasosSuccess
  | CreateTraspaso
  | CreateTraspasoSuccess
  | DeleteTraspaso
  | DeleteTraspasoSuccess
  | UpdateTraspaso
  | UpdateTraspasoSuccess
  | TraspasoError
  | UpsertTraspaso;
