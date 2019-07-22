import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../models';

export enum RequisicionesDeMaterialActionTypes {
  LoadRequisiciones = '[Requisiciones Component] Load Requisiciones',
  LoadRequisicionesFail = '[Requisiciones de Material API] Load Requisiciones fail',
  LoadRequisicionesSuccess = '[Requisiciones de Material API] Load Requisiciones Success'
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

export type RequisicionesDeMaterialActions =
  | LoadRequisicionesDeMaterial
  | LoadRequisicionesDeMaterialFail
  | LoadRequisicionesDeMaterialSuccess;
