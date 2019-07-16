import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';
import { Periodo } from 'app/_core/models/periodo';

export enum NotaActionTypes {
  SetPeriodoDeNotas = '[Notas CXP] Set Periodo de notas',
  LoadNotas = '[Notas CXP] Load Notas ',
  LoadNotasFail = '[Notas CXP] Load Notas  fail',
  LoadNotasSuccess = '[Notas CXP] Load Notas  Success',
  AddNota = '[Notas CXP] Add Nota',
  AddNotaFail = '[Notas CXP] Add Nota Fail',
  AddNotaSuccess = '[Notas CXP] Add Nota Success',
  UpsertNota = '[Notas CXP] Upsert Nota',
  UpdateNota = '[Notas CXP] Update Nota',
  UpdateNotaFail = '[Notas CXP] Update Nota Fail',
  UpdateNotaSuccess = '[Notas CXP] Update Nota Success',
  DeleteNota = '[Notas CXP] Delete Nota',
  DeleteNotaFail = '[Notas CXP] Delete Nota Fail',
  DeleteNotaSuccess = '[Notas CXP] Delete Nota Success',
  ClearNotas = '[Notas CXP] Clear Notas',
  SetSearchTerm = '[Notas CXP] Set Search term de notas',
  Load = '[Notas CXP] Load One Nota',
  LoadFail = '[Notas CXP] Load One Nota fail',
  LoadSuccess = '[Notas CXP] Load One Nota Success',
  AplicarNota = '[Notas CXP] Aplicar  Nota '
}

export class LoadNotas implements Action {
  readonly type = NotaActionTypes.LoadNotas;
}
export class LoadNotasFail implements Action {
  readonly type = NotaActionTypes.LoadNotasFail;
  constructor(public payload: any) {}
}
export class LoadNotasSuccess implements Action {
  readonly type = NotaActionTypes.LoadNotasSuccess;

  constructor(public payload: NotaDeCreditoCxP[]) {}
}

export class AddNota implements Action {
  readonly type = NotaActionTypes.AddNota;
  constructor(public payload: NotaDeCreditoCxP) {}
}
export class AddNotaFail implements Action {
  readonly type = NotaActionTypes.AddNotaFail;

  constructor(public payload: any) {}
}
export class AddNotaSuccess implements Action {
  readonly type = NotaActionTypes.AddNotaSuccess;

  constructor(public payload: NotaDeCreditoCxP) {}
}

export class UpdateNota implements Action {
  readonly type = NotaActionTypes.UpdateNota;

  constructor(public payload: NotaDeCreditoCxP) {}
}
export class UpdateNotaFail implements Action {
  readonly type = NotaActionTypes.UpdateNotaFail;

  constructor(public payload: any) {}
}
export class UpdateNotaSuccess implements Action {
  readonly type = NotaActionTypes.UpdateNotaSuccess;

  constructor(public payload: NotaDeCreditoCxP) {}
}

export class UpsertNota implements Action {
  readonly type = NotaActionTypes.UpsertNota;

  constructor(public payload: { nota: NotaDeCreditoCxP }) {}
}

export class DeleteNota implements Action {
  readonly type = NotaActionTypes.DeleteNota;

  constructor(public payload: NotaDeCreditoCxP) {}
}
export class DeleteNotaFail implements Action {
  readonly type = NotaActionTypes.DeleteNotaFail;

  constructor(public payload: any) {}
}
export class DeleteNotaSuccess implements Action {
  readonly type = NotaActionTypes.DeleteNotaSuccess;

  constructor(public payload: NotaDeCreditoCxP) {}
}

export class ClearNotas implements Action {
  readonly type = NotaActionTypes.ClearNotas;
}

export class SetPeriodoDeNotas implements Action {
  readonly type = NotaActionTypes.SetPeriodoDeNotas;
  constructor(public payload: { periodo: Periodo }) {}
}
export class SetSearchTerm implements Action {
  readonly type = NotaActionTypes.SetSearchTerm;
  constructor(public payload: string) {}
}

export class AplicarNota implements Action {
  readonly type = NotaActionTypes.AplicarNota;

  constructor(public payload: NotaDeCreditoCxP) {}
}

export type NotaActions =
  | LoadNotas
  | LoadNotasFail
  | LoadNotasSuccess
  | AddNota
  | AddNotaFail
  | AddNotaSuccess
  | UpdateNota
  | UpdateNotaFail
  | UpdateNotaSuccess
  | UpsertNota
  | DeleteNota
  | DeleteNotaFail
  | DeleteNotaSuccess
  | ClearNotas
  | SetPeriodoDeNotas
  | SetSearchTerm
  | AplicarNota;
