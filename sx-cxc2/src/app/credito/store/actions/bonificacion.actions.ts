import { Action } from '@ngrx/store';

import { Update } from '@ngrx/entity';

import { Cartera, CarteraFilter, NotaDeCredito } from 'app/cobranza/models';

export enum BonificacionActionTypes {
  LoadBonificaciones = '[Bonificacion Component] Load Bonificacions',
  LoadBonificacionesSuccess = '[Bonificacion Effect] Load Bonificacions Success',
  LoadBonificacionesFail = '[Bonificacion Effect] Load Bonificacions Fail',

  // Create
  CreateBonificacion = '[Bonificacion component] Create Bonificacion',
  CreateBonificacionFail = '[Bonificacion effect] Create Bonificacion Fail',
  CreateBonificacionSuccess = '[Bonificacion effect] Create Bonificacion Success',

  // Update
  UpdateBonificacion = '[Bonificacion component] Update Bonificacion',
  UpdateBonificacionFail = '[Bonificacion effect] Update Bonificacion fail',
  UpdateBonificacionSuccess = '[Bonificacion effect] Update Bonificacion success',

  // Delete
  DeleteBonificacion = '[Bonificacion component] Delete Bonificacion',
  DeleteBonificacionFail = '[Bonificacion effect] Delete Bonificacion fail',
  DeleteBonificacionSuccess = '[Bonificacion effect] Delete Bonificacion success',

  UpsertBonificacion = '[Bonificacion component] Upsert Bonificacion'
}

export class LoadBonificaciones implements Action {
  readonly type = BonificacionActionTypes.LoadBonificaciones;
  constructor(public payload: { cartera: Cartera; filter?: CarteraFilter }) {}
}

export class LoadBonificacionesSuccess implements Action {
  readonly type = BonificacionActionTypes.LoadBonificacionesSuccess;
  constructor(public payload: { bonificaciones: NotaDeCredito[] }) {}
}

export class LoadBonificacionesFail implements Action {
  readonly type = BonificacionActionTypes.LoadBonificacionesFail;
  constructor(public payload: { response: any }) {}
}

// Create
export class CreateBonificacion implements Action {
  readonly type = BonificacionActionTypes.CreateBonificacion;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}
export class CreateBonificacionFail implements Action {
  readonly type = BonificacionActionTypes.CreateBonificacionFail;
  constructor(public payload: { response: any }) {}
}
export class CreateBonificacionSuccess implements Action {
  readonly type = BonificacionActionTypes.CreateBonificacionSuccess;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}

// Update
export class UpdateBonificacion implements Action {
  readonly type = BonificacionActionTypes.UpdateBonificacion;
  constructor(public payload: { update: Update<NotaDeCredito> }) {}
}
export class UpdateBonificacionFail implements Action {
  readonly type = BonificacionActionTypes.UpdateBonificacionFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateBonificacionSuccess implements Action {
  readonly type = BonificacionActionTypes.UpdateBonificacionSuccess;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}

// Delete
export class DeleteBonificacion implements Action {
  readonly type = BonificacionActionTypes.DeleteBonificacion;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}
export class DeleteBonificacionFail implements Action {
  readonly type = BonificacionActionTypes.DeleteBonificacionFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteBonificacionSuccess implements Action {
  readonly type = BonificacionActionTypes.DeleteBonificacionSuccess;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}

export class UpsertBonificacion implements Action {
  readonly type = BonificacionActionTypes.UpsertBonificacion;
  constructor(public payload: { bonificacion: NotaDeCredito }) {}
}

export type BonificacionActions =
  | LoadBonificaciones
  | LoadBonificacionesFail
  | LoadBonificacionesSuccess
  | CreateBonificacion
  | CreateBonificacionFail
  | CreateBonificacionSuccess
  | UpdateBonificacion
  | UpdateBonificacionFail
  | UpdateBonificacionSuccess
  | DeleteBonificacion
  | DeleteBonificacionFail
  | DeleteBonificacionSuccess
  | UpsertBonificacion;
