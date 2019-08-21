import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { Recibo } from '../models';
import { Update } from '@ngrx/entity';

export enum ReciboActionTypes {
  SetPeriodo = '[Recibos component] Set Periodo',
  LoadRecibos = '[Recibos component] Load recibos',
  LoadRecibosFail = '[Recibos API] Load recibos fail',
  LoadRecibosSuccess = '[Recibos API] Load recibos Success',

  // Update
  UpdateRecibo = '[Recibo component] Update recibo',
  UpdateReciboFail = '[Recibos API] Update recibo fail',
  UpdateReciboSuccess = '[Recibos API] Update recibo Success',
  UpsertRecibo = '[Recibos exist guard] Recibo upsert',

  // Asignar requisicion
  AsignarRequisicionRecibo = '[Recibo component] Asignar requisicion ',

  QuitarRequisicionRecibo = '[Recibo component] Quitar requisicion',
  QuitarRequisicionReciboFail = '[Recibo effects] Quitar requisicion fil',
  QuitarRequisicionReciboSuccess = '[Recibo effects] Quitar requisicion success',

  // DELETE
  DeleteRecibo = '[Recibo component] Delete recibo',
  DeleteReciboFail = '[Recibos API] Delete recibo fail',
  DeleteReciboSuccess = '[Recibos API] Delete recibo Success'
}

export class SetPeriodo implements Action {
  readonly type = ReciboActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadRecibos implements Action {
  readonly type = ReciboActionTypes.LoadRecibos;
}
export class LoadRecibosFail implements Action {
  readonly type = ReciboActionTypes.LoadRecibosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadRecibosSuccess implements Action {
  readonly type = ReciboActionTypes.LoadRecibosSuccess;
  constructor(public payload: { recibos: Recibo[] }) {}
}

// Update
export class UpdateRecibo implements Action {
  readonly type = ReciboActionTypes.UpdateRecibo;
  constructor(public payload: { update: Update<Recibo> }) {}
}
export class UpdateReciboFail implements Action {
  readonly type = ReciboActionTypes.UpdateReciboFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateReciboSuccess implements Action {
  readonly type = ReciboActionTypes.UpdateReciboSuccess;
  constructor(public payload: { recibo: Recibo }) {}
}

export class UpsertRecibo implements Action {
  readonly type = ReciboActionTypes.UpsertRecibo;
  constructor(public payload: { recibo: Recibo }) {}
}

// Delete
export class DeleteRecibo implements Action {
  readonly type = ReciboActionTypes.DeleteRecibo;
  constructor(public payload: { recibo: Partial<Recibo> }) {}
}
export class DeleteReciboFail implements Action {
  readonly type = ReciboActionTypes.DeleteReciboFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteReciboSuccess implements Action {
  readonly type = ReciboActionTypes.DeleteReciboSuccess;
  constructor(public payload: { recibo: Partial<Recibo> }) {}
}

// Asignar Requisicion
export class AsignarRequisicionRecibo implements Action {
  readonly type = ReciboActionTypes.AsignarRequisicionRecibo;
  constructor(public payload: { reciboId: number; requisicionId: string }) {}
}

export class QuitarRequisicionRecibo implements Action {
  readonly type = ReciboActionTypes.QuitarRequisicionRecibo;
  constructor(public payload: { reciboId: number }) {}
}
export class QuitarRequisicionReciboFail implements Action {
  readonly type = ReciboActionTypes.QuitarRequisicionReciboFail;
  constructor(public payload: { response: any }) {}
}
export class QuitarRequisicionReciboSuccess implements Action {
  readonly type = ReciboActionTypes.QuitarRequisicionReciboSuccess;
  constructor(public payload: { recibo: Recibo }) {}
}

export type RecibosActions =
  | SetPeriodo
  | LoadRecibos
  | LoadRecibosFail
  | LoadRecibosSuccess
  | UpdateRecibo
  | UpdateReciboFail
  | UpdateReciboSuccess
  | UpsertRecibo
  | DeleteRecibo
  | DeleteReciboFail
  | DeleteReciboSuccess
  | AsignarRequisicionRecibo
  | QuitarRequisicionRecibo
  | QuitarRequisicionReciboFail
  | QuitarRequisicionReciboSuccess;
