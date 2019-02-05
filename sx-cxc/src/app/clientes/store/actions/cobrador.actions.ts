import { Action } from '@ngrx/store';

import { Cobrador } from '../../models';
import { Update } from '@ngrx/entity';

export enum CobradorActionTypes {
  LoadCobradores = '[Cobradores Guard] Load Cobradores',
  LoadCobradoresSuccess = '[Cobrador API] Load Cobradores Success',
  LoadCobradoresFail = '[Cobrador API] Load Cobradores Fail',

  CreateCobrador = '[Cobrador Component] Cobrador create',
  CreateCobradorSuccess = '[Cobrador API] Cobrador create  Success',
  CreateCobradorFail = '[Cobrador API] Cobrador create  Fail',

  DeleteCobrador = '[Cobrador Component] Delete Cobrador',
  DeleteCobradorFail = '[Cobrador API] Delete Cobrador Fail',
  DeleteCobradorSuccess = '[Cobrador API] Delete Cobrador Success',

  UpdateCobrador = '[Cobrador Component] Update Cobrador',
  UpdateCobradorFail = '[Cobrador API] Update Cobrador Fail',
  UpdateCobradorSuccess = '[Cobrador API] Update Cobrador Success'
}

// Load
export class LoadCobradores implements Action {
  readonly type = CobradorActionTypes.LoadCobradores;
}
export class LoadCobradoresFail implements Action {
  readonly type = CobradorActionTypes.LoadCobradoresFail;

  constructor(public payload: { response: any }) {}
}
export class LoadCobradoresSuccess implements Action {
  readonly type = CobradorActionTypes.LoadCobradoresSuccess;

  constructor(public payload: { cobradores: Cobrador[] }) {}
}

// Alta
export class CreateCobrador implements Action {
  readonly type = CobradorActionTypes.CreateCobrador;
  constructor(public payload: { cobrador: Cobrador }) {}
}
export class CreateCobradorFail implements Action {
  readonly type = CobradorActionTypes.CreateCobradorFail;
  constructor(public payload: { response: any }) {}
}
export class CreateCobradorSuccess implements Action {
  readonly type = CobradorActionTypes.CreateCobradorSuccess;
  constructor(public payload: { cobrador: Cobrador }) {}
}

// Delete
export class DeleteCobrador implements Action {
  readonly type = CobradorActionTypes.DeleteCobrador;

  constructor(public payload: { cobrador: Cobrador }) {}
}
export class DeleteCobradorFail implements Action {
  readonly type = CobradorActionTypes.DeleteCobradorFail;

  constructor(public payload: { response: any }) {}
}
export class DeleteCobradorSuccess implements Action {
  readonly type = CobradorActionTypes.DeleteCobradorSuccess;

  constructor(public payload: { cobrador: Cobrador }) {}
}
// Update
export class UpdateCobrador implements Action {
  readonly type = CobradorActionTypes.UpdateCobrador;

  constructor(public payload: { cobrador: Update<Cobrador> }) {}
}
export class UpdateCobradorFail implements Action {
  readonly type = CobradorActionTypes.UpdateCobradorFail;

  constructor(public payload: { response: any }) {}
}
export class UpdateCobradorSuccess implements Action {
  readonly type = CobradorActionTypes.UpdateCobradorSuccess;

  constructor(public payload: { cobrador: Cobrador }) {}
}

export type CobradorActions =
  | LoadCobradores
  | LoadCobradoresFail
  | LoadCobradoresSuccess
  | CreateCobrador
  | CreateCobradorFail
  | CreateCobradorSuccess
  | DeleteCobrador
  | DeleteCobradorFail
  | DeleteCobradorSuccess
  | UpdateCobrador
  | UpdateCobradorFail
  | UpdateCobradorSuccess;
