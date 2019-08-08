import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { Existencia } from '../models';
import { Update } from '@ngrx/entity';

export enum ExistenciaActionTypes {
  SetPeriodo = '[Existencias component] Set Periodo',
  LoadExistencias = '[Existencias component] Load Existencias',
  LoadExistenciasFail = '[Existencias API] Load Existencias fail',
  LoadExistenciasSuccess = '[Existencias API] Load Existencias Success',

  // Update
  UpdateExistencia = '[Existencia component] Update Existencia',
  UpdateExistenciaFail = '[Existencias API] Update Existencia fail',
  UpdateExistenciaSuccess = '[Existencias API] Update Existencia Success',
  UpsertExistencia = '[Existencias exist guard] Existencia upsert'
}

export class SetPeriodo implements Action {
  readonly type = ExistenciaActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadExistencias implements Action {
  readonly type = ExistenciaActionTypes.LoadExistencias;
}
export class LoadExistenciasFail implements Action {
  readonly type = ExistenciaActionTypes.LoadExistenciasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadExistenciasSuccess implements Action {
  readonly type = ExistenciaActionTypes.LoadExistenciasSuccess;
  constructor(public payload: { existencias: Existencia[] }) {}
}

// Update
export class UpdateExistencia implements Action {
  readonly type = ExistenciaActionTypes.UpdateExistencia;
  constructor(public payload: { update: Update<Existencia> }) {}
}
export class UpdateExistenciaFail implements Action {
  readonly type = ExistenciaActionTypes.UpdateExistenciaFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateExistenciaSuccess implements Action {
  readonly type = ExistenciaActionTypes.UpdateExistenciaSuccess;
  constructor(public payload: { existencia: Existencia }) {}
}

export class UpsertExistencia implements Action {
  readonly type = ExistenciaActionTypes.UpsertExistencia;
  constructor(public payload: { existencia: Existencia }) {}
}

export type ExistenciaActions =
  | SetPeriodo
  | LoadExistencias
  | LoadExistenciasFail
  | LoadExistenciasSuccess
  | UpdateExistencia
  | UpdateExistenciaFail
  | UpdateExistenciaSuccess
  | UpsertExistencia;
