import { Action } from '@ngrx/store';

import { Pago, PagosFilter } from '../../model';

export enum PagoActionTypes {
  SetPagosFilter = '[Pagos Component ] Set pagos filter',
  SetPagosSearchTerm = '[Pagos Component] Set pagos term',
  LoadPagos = '[Pago] Load Pagos',
  LoadPagosFail = '[Pago] Load Pagos fail',
  LoadPagosSuccess = '[Pago] Load Pagos Success',
  UpsertPago = '[Pago] Upsert Pago',
  UpsertPagos = '[Pago] Upsert many Pagos',
  UpdatePago = '[Pago] Update Pago',
  UpdatePagoFail = '[Pago] Update Pago Fail',
  UpdatePagoSuccess = '[Pago] Update Pago Success',
  DeletePago = '[Pago] Delete Pago',
  DeletePagoFail = '[Pago] Delete Pago Fail',
  DeletePagoSuccess = '[Pago] Delete Pago Success',
  ClearPagos = '[Pago] Clear Pagos',
  LoadPago = '[Pago] Load One Pago',
  LoadFail = '[Pago] Load One Pago fail',
  LoadSuccess = '[Pago] Load One Pago Success',
  AplicarPago = '[Pago] Aplicar  Pago '
}

export class SetPagosFilter implements Action {
  readonly type = PagoActionTypes.SetPagosFilter;
  constructor(public payload: { filter: PagosFilter }) {}
}

export class SetPagosSearchTerm implements Action {
  readonly type = PagoActionTypes.SetPagosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadPagos implements Action {
  readonly type = PagoActionTypes.LoadPagos;
}
export class LoadPagosFail implements Action {
  readonly type = PagoActionTypes.LoadPagosFail;
  constructor(public payload: any) {}
}
export class LoadPagosSuccess implements Action {
  readonly type = PagoActionTypes.LoadPagosSuccess;

  constructor(public payload: Pago[]) {}
}

export class UpdatePago implements Action {
  readonly type = PagoActionTypes.UpdatePago;

  constructor(public payload: Pago) {}
}
export class UpdatePagoFail implements Action {
  readonly type = PagoActionTypes.UpdatePagoFail;

  constructor(public payload: any) {}
}
export class UpdatePagoSuccess implements Action {
  readonly type = PagoActionTypes.UpdatePagoSuccess;

  constructor(public payload: Pago) {}
}

export class UpsertPago implements Action {
  readonly type = PagoActionTypes.UpsertPago;

  constructor(public payload: { pago: Pago }) {}
}
export class UpsertPagos implements Action {
  readonly type = PagoActionTypes.UpsertPagos;

  constructor(public payload: Pago[]) {}
}

export class DeletePago implements Action {
  readonly type = PagoActionTypes.DeletePago;

  constructor(public payload: Pago) {}
}
export class DeletePagoFail implements Action {
  readonly type = PagoActionTypes.DeletePagoFail;

  constructor(public payload: any) {}
}
export class DeletePagoSuccess implements Action {
  readonly type = PagoActionTypes.DeletePagoSuccess;

  constructor(public payload: Pago) {}
}

export class ClearPagos implements Action {
  readonly type = PagoActionTypes.ClearPagos;
}

export class AplicarPago implements Action {
  readonly type = PagoActionTypes.AplicarPago;

  constructor(public payload: Pago) {}
}

export type PagoActions =
  | SetPagosFilter
  | SetPagosSearchTerm
  | LoadPagos
  | LoadPagosFail
  | LoadPagosSuccess
  | UpdatePago
  | UpdatePagoFail
  | UpdatePagoSuccess
  | UpsertPago
  | UpsertPagos
  | DeletePago
  | DeletePagoFail
  | DeletePagoSuccess
  | ClearPagos
  | AplicarPago;
