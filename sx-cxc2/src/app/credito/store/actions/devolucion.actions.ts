import { Action } from '@ngrx/store';

import { Update } from '@ngrx/entity';

import { Cartera, CarteraFilter, NotaDeCredito } from 'app/cobranza/models';

export enum DevolucionActionTypes {
  LoadDevoluciones = '[Devolucion Component] Load Devolucions',
  LoadDevolucionesSuccess = '[Devolucion Effect] Load Devolucions Success',
  LoadDevolucionesFail = '[Devolucion Effect] Load Devolucions Fail',

  // Create
  CreateDevolucion = '[Devolucion component] Create Devolucion',
  CreateDevolucionFail = '[Devolucion effect] Create Devolucion Fail',
  CreateDevolucionSuccess = '[Devolucion effect] Create Devolucion Success',

  // Update
  UpdateDevolucion = '[Devolucion component] Update Devolucion',
  UpdateDevolucionFail = '[Devolucion effect] Update Devolucion fail',
  UpdateDevolucionSuccess = '[Devolucion effect] Update Devolucion success',

  // Delete
  DeleteDevolucion = '[Devolucion component] Delete Devolucion',
  DeleteDevolucionFail = '[Devolucion effect] Delete Devolucion fail',
  DeleteDevolucionSuccess = '[Devolucion effect] Delete Devolucion success',

  UpsertDevolucion = '[Devolucion component] Upsert Devolucion'
}

export class LoadDevoluciones implements Action {
  readonly type = DevolucionActionTypes.LoadDevoluciones;
  constructor(public payload: { cartera: Cartera; filter?: CarteraFilter }) {}
}

export class LoadDevolucionesSuccess implements Action {
  readonly type = DevolucionActionTypes.LoadDevolucionesSuccess;
  constructor(public payload: { devoluciones: NotaDeCredito[] }) {}
}

export class LoadDevolucionesFail implements Action {
  readonly type = DevolucionActionTypes.LoadDevolucionesFail;
  constructor(public payload: { response: any }) {}
}

// Create
export class CreateDevolucion implements Action {
  readonly type = DevolucionActionTypes.CreateDevolucion;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}
export class CreateDevolucionFail implements Action {
  readonly type = DevolucionActionTypes.CreateDevolucionFail;
  constructor(public payload: { response: any }) {}
}
export class CreateDevolucionSuccess implements Action {
  readonly type = DevolucionActionTypes.CreateDevolucionSuccess;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}

// Update
export class UpdateDevolucion implements Action {
  readonly type = DevolucionActionTypes.UpdateDevolucion;
  constructor(public payload: { update: Update<NotaDeCredito> }) {}
}
export class UpdateDevolucionFail implements Action {
  readonly type = DevolucionActionTypes.UpdateDevolucionFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateDevolucionSuccess implements Action {
  readonly type = DevolucionActionTypes.UpdateDevolucionSuccess;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}

// Delete
export class DeleteDevolucion implements Action {
  readonly type = DevolucionActionTypes.DeleteDevolucion;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}
export class DeleteDevolucionFail implements Action {
  readonly type = DevolucionActionTypes.DeleteDevolucionFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteDevolucionSuccess implements Action {
  readonly type = DevolucionActionTypes.DeleteDevolucionSuccess;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}

export class UpsertDevolucion implements Action {
  readonly type = DevolucionActionTypes.UpsertDevolucion;
  constructor(public payload: { devolucion: NotaDeCredito }) {}
}

export type DevolucionActions =
  | LoadDevoluciones
  | LoadDevolucionesFail
  | LoadDevolucionesSuccess
  | CreateDevolucion
  | CreateDevolucionFail
  | CreateDevolucionSuccess
  | UpdateDevolucion
  | UpdateDevolucionFail
  | UpdateDevolucionSuccess
  | DeleteDevolucion
  | DeleteDevolucionFail
  | DeleteDevolucionSuccess
  | UpsertDevolucion;
