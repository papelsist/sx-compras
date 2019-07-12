import { Action } from '@ngrx/store';

import { NotaDeCredito, Cartera, CarteraFilter } from '../../models';
import { Update } from '@ngrx/entity';

export enum NotaDeCreditoActionTypes {
  LoadNotasDeCredito = '[NotaDeCredito Component] Load NotaDeCreditos',
  LoadNotasDeCreditoSuccess = '[NotaDeCredito Effect] Load NotaDeCreditos Success',
  LoadNotasDeCreditoFail = '[NotaDeCredito Effect] Load NotaDeCreditos Fail',

  // Create
  CreateNotaDeCredito = '[NotaDeCredito component] Create NotaDeCredito',
  CreateNotaDeCreditoFail = '[NotaDeCredito effect] Create NotaDeCredito Fail',
  CreateNotaDeCreditoSuccess = '[NotaDeCredito effect] Create NotaDeCredito Success',

  // Update
  UpdateNotaDeCredito = '[NotaDeCredito component] Update NotaDeCredito',
  UpdateNotaDeCreditoFail = '[NotaDeCredito effect] Update NotaDeCredito fail',
  UpdateNotaDeCreditoSuccess = '[NotaDeCredito effect] Update NotaDeCredito success',

  // Delete
  DeleteNotaDeCredito = '[NotaDeCredito component] Delete NotaDeCredito',
  DeleteNotaDeCreditoFail = '[NotaDeCredito effect] Delete NotaDeCredito fail',
  DeleteNotaDeCreditoSuccess = '[NotaDeCredito effect] Delete NotaDeCredito success',

  UpsertNotaDeCredito = '[NotaDeCredito component] Upsert NotaDeCredito'
}

export class LoadNotasDeCredito implements Action {
  readonly type = NotaDeCreditoActionTypes.LoadNotasDeCredito;
  constructor(
    public payload: { cartera: Cartera; tipo: string; filter?: CarteraFilter }
  ) {}
}

export class LoadNotasDeCreditoSuccess implements Action {
  readonly type = NotaDeCreditoActionTypes.LoadNotasDeCreditoSuccess;
  constructor(public payload: { notas: NotaDeCredito[] }) {}
}

export class LoadNotasDeCreditoFail implements Action {
  readonly type = NotaDeCreditoActionTypes.LoadNotasDeCreditoFail;
  constructor(public payload: { response: any }) {}
}

// Create
export class CreateNotaDeCredito implements Action {
  readonly type = NotaDeCreditoActionTypes.CreateNotaDeCredito;
  constructor(public payload: { nota: NotaDeCredito }) {}
}
export class CreateNotaDeCreditoFail implements Action {
  readonly type = NotaDeCreditoActionTypes.CreateNotaDeCreditoFail;
  constructor(public payload: { response: any }) {}
}
export class CreateNotaDeCreditoSuccess implements Action {
  readonly type = NotaDeCreditoActionTypes.CreateNotaDeCreditoSuccess;
  constructor(public payload: { nota: NotaDeCredito }) {}
}

// Update
export class UpdateNotaDeCredito implements Action {
  readonly type = NotaDeCreditoActionTypes.UpdateNotaDeCredito;
  constructor(public payload: { update: Update<NotaDeCredito> }) {}
}
export class UpdateNotaDeCreditoFail implements Action {
  readonly type = NotaDeCreditoActionTypes.UpdateNotaDeCreditoFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateNotaDeCreditoSuccess implements Action {
  readonly type = NotaDeCreditoActionTypes.UpdateNotaDeCreditoSuccess;
  constructor(public payload: { nota: NotaDeCredito }) {}
}

// Delete
export class DeleteNotaDeCredito implements Action {
  readonly type = NotaDeCreditoActionTypes.DeleteNotaDeCredito;
  constructor(public payload: { nota: NotaDeCredito }) {}
}
export class DeleteNotaDeCreditoFail implements Action {
  readonly type = NotaDeCreditoActionTypes.DeleteNotaDeCreditoFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteNotaDeCreditoSuccess implements Action {
  readonly type = NotaDeCreditoActionTypes.DeleteNotaDeCreditoSuccess;
  constructor(public payload: { nota: NotaDeCredito }) {}
}

export class UpsertNotaDeCredito implements Action {
  readonly type = NotaDeCreditoActionTypes.UpsertNotaDeCredito;
  constructor(public payload: { nota: NotaDeCredito }) {}
}

export type NotaDeCreditoActions =
  | LoadNotasDeCredito
  | LoadNotasDeCreditoFail
  | LoadNotasDeCreditoSuccess
  | CreateNotaDeCredito
  | CreateNotaDeCreditoFail
  | CreateNotaDeCreditoSuccess
  | UpdateNotaDeCredito
  | UpdateNotaDeCreditoFail
  | UpdateNotaDeCreditoSuccess
  | DeleteNotaDeCredito
  | DeleteNotaDeCreditoFail
  | DeleteNotaDeCreditoSuccess
  | UpsertNotaDeCredito;
