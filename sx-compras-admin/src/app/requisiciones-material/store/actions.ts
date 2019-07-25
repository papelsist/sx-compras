import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { RequisicionDeMaterial } from '../models';
import { Update } from '@ngrx/entity';

export enum RequisicionesDeMaterialActionTypes {
  SetPeriodo = '[Requisiciones de Material Component] Set Periodo',
  LoadRequisiciones = '[Requisiciones de Material Component] Load Requisiciones',
  LoadRequisicionesFail = '[Requisiciones de Material API] Load Requisiciones fail',
  LoadRequisicionesSuccess = '[Requisiciones de Material API] Load Requisiciones Success',
  // Create
  CreateRequisicionDeMaterial = '[Requisiciones de Material Component] Create Requisiciones',
  CreateRequisicionDeMaterialFail = '[Requisiciones de Material API] Create Requisiciones fail',
  CreateRequisicionDeMaterialSuccess = '[Requisiciones de Material API] Create Requisiciones Success',
  // Update
  UpdateRequisicionDeMaterial = '[Requisiciones de Material Component] Update Requisiciones',
  UpdateRequisicionDeMaterialFail = '[Requisiciones de Material API] Update Requisiciones fail',
  UpdateRequisicionDeMaterialSuccess = '[Requisiciones de Material API] Update Requisiciones Success',
  UpsertRequisicion = '[Requisicion exist guard] Requisicion upsert',
  // DELETE
  DeleteRequisicionDeMaterial = '[Requisiciones de Material Component] Delete Requisiciones',
  DeleteRequisicionDeMaterialFail = '[Requisiciones de Material API] Delete Requisiciones fail',
  DeleteRequisicionDeMaterialSuccess = '[Requisiciones de Material API] Delete Requisiciones Success',

  // Generar Compra
  GenerarCompraDeMaterial = '[Requisiciones de Material Component] Generar Compra de material',
  GenerarCompraDeMaterialFail = '[Requisiciones de Material API] Generar Compra de material fail',
  GenerarCompraDeMaterialSuccess = '[Requisiciones de Material API] Generar Compra de material Success'
}

export class SetPeriodo implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadRequisicionesDeMaterial implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.LoadRequisiciones;
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
// Update
export class UpdateRequisicionDeMaterial implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterial;
  constructor(public payload: { update: Update<RequisicionDeMaterial> }) {}
}
export class UpdateRequisicionDeMaterialFail implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterialFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateRequisicionDeMaterialSuccess implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.UpdateRequisicionDeMaterialSuccess;
  constructor(public payload: { requisicion: RequisicionDeMaterial }) {}
}

export class UpsertRrequisicionDeMaterial implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.UpsertRequisicion;
  constructor(public payload: { requisicion: RequisicionDeMaterial }) {}
}

// Delete
export class DeleteRequisicionDeMaterial implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterial;
  constructor(
    public payload: { requisicion: Partial<RequisicionDeMaterial> }
  ) {}
}
export class DeleteRequisicionDeMaterialFail implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteRequisicionDeMaterialSuccess implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.DeleteRequisicionDeMaterialSuccess;
  constructor(
    public payload: { requisicion: Partial<RequisicionDeMaterial> }
  ) {}
}

// Generar COMPRA
export class GenerarCompraDeMaterial implements Action {
  readonly type = RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterial;
  constructor(
    public payload: { requisicion: Partial<RequisicionDeMaterial> }
  ) {}
}
export class GenerarCompraDeMaterialFail implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialFail;
  constructor(public payload: { response: any }) {}
}
export class GenerarCompraDeMaterialSuccess implements Action {
  readonly type =
    RequisicionesDeMaterialActionTypes.GenerarCompraDeMaterialSuccess;
  constructor(public payload: { requisicion: RequisicionDeMaterial }) {}
}
export type RequisicionesDeMaterialActions =
  | SetPeriodo
  | LoadRequisicionesDeMaterial
  | LoadRequisicionesDeMaterialFail
  | LoadRequisicionesDeMaterialSuccess
  | CreateRequisicionDeMaterial
  | CreateRequisicionDeMaterialFail
  | CreateRequisicionDeMaterialSuccess
  | UpdateRequisicionDeMaterial
  | UpdateRequisicionDeMaterialFail
  | UpdateRequisicionDeMaterialSuccess
  | UpsertRrequisicionDeMaterial
  | DeleteRequisicionDeMaterial
  | DeleteRequisicionDeMaterialFail
  | DeleteRequisicionDeMaterialSuccess
  | GenerarCompraDeMaterial
  | GenerarCompraDeMaterialFail
  | GenerarCompraDeMaterialSuccess;
