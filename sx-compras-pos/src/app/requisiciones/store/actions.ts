import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../models';

export enum RequisicionesDeMaterialActionTypes {
  SetPeriodo = '[Requisiciones de Material Component] Set Periodo',
  LoadRequisiciones = '[Requisiciones de Material Component] Load Requisiciones',
  LoadRequisicionesFail = '[Requisiciones de Material API] Load Requisiciones fail',
  LoadRequisicionesSuccess = '[Requisiciones de Material API] Load Requisiciones Success',
  // Create
  CreateRequisicionDeMaterial = '[Requisiciones de Material Component] Create Requisiciones',
  CreateRequisicionDeMaterialFail = '[Requisiciones de Material API] Create Requisiciones fail',
  CreateRequisicionDeMaterialSuccess = '[Requisiciones de Material API] Create Requisiciones Success'
}

export class SetPeriodo implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadRequisicionesDeMaterial implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.LoadRequisiciones;
  constructor(public payload: { periodo: Periodo }) {}
}
export class LoadRequisicionesDeMaterialFail implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.LoadRequisicionesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadRequisicionesDeMaterialSuccess implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.LoadRequisicionesSuccess;
  constructor(public payload: { requisiciones: RequisicionDeMaterial[] }) {}
}
// Create
export class CreateRequisicionDeMaterial implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterial;
  constructor(
    public payload: { requisicion: Partial<RequisicionDeMaterial> }
  ) {}
}
export class CreateRequisicionDeMaterialFail implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialFail;
  constructor(public payload: { response: any }) {}
}
export class CreateRequisicionDeMaterialSuccess implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.CreateRequisicionDeMaterialSuccess;
  constructor(public payload: { requisicion: RequisicionDeMaterial }) {}
}

export type RequisicionesDeMaterialActions =
  | SetPeriodo
  | LoadRequisicionesDeMaterial
  | LoadRequisicionesDeMaterialFail
  | LoadRequisicionesDeMaterialSuccess
  | CreateRequisicionDeMaterial
  | CreateRequisicionDeMaterialFail
  | CreateRequisicionDeMaterialSuccess;
