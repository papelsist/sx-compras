import { Action } from '@ngrx/store';

import { Requisicion, RequisicionesFilter } from '../../models';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

export enum GastosActionTypes {
  SetGastosFilter = '[Gasto] Set requisiciones filter',

  LoadGastos = '[Gasto] Load requsiciones',
  LoadGastosFail = '[Gasto] Load requsiciones Fail',
  LoadGastosSuccess = '[Gasto] Load requsiciones Success',

  UpsertGasto = '[ Gasto] Upsert gasto',

  PagarGasto = '[Gasto] Pagar',
  PagarGastoFail = '[Gasto] Pagar fail',
  PagarGastoSuccess = '[Gasto] Pagar success',

  CancelarPagarGasto = '[Gasto component] Cancelar pago',
  CancelarPagarGastoFail = '[Gasto API] Cancelar pago fail',
  CancelarPagarGastoSuccess = '[Gasto API] Cancelar pago success'
}

export class SetGastosFilter implements Action {
  readonly type = GastosActionTypes.SetGastosFilter;
  constructor(public payload: { filter: RequisicionesFilter }) {}
}

export class LoadGastos implements Action {
  readonly type = GastosActionTypes.LoadGastos;
}
export class LoadGastosFail implements Action {
  readonly type = GastosActionTypes.LoadGastosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadGastosSuccess implements Action {
  readonly type = GastosActionTypes.LoadGastosSuccess;
  constructor(public payload: { requisiciones: Requisicion[] }) {}
}

export class UpsertGasto implements Action {
  readonly type = GastosActionTypes.UpsertGasto;
  constructor(public payload: { requisicion: Requisicion }) {}
}

// Pagar
export class PagarGasto implements Action {
  readonly type = GastosActionTypes.PagarGasto;
  constructor(public payload: { pago: PagoDeRequisicion }) {}
}
export class PagarGastoFail implements Action {
  readonly type = GastosActionTypes.PagarGastoFail;
  constructor(public payload: { response: any }) {}
}
export class PagarGastoSuccess implements Action {
  readonly type = GastosActionTypes.PagarGastoSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

// Cancelar pago
export class CancelarPagarGasto implements Action {
  readonly type = GastosActionTypes.CancelarPagarGasto;
  constructor(public payload: { pago: PagoDeRequisicion }) {}
}
export class CancelarPagarGastoFail implements Action {
  readonly type = GastosActionTypes.CancelarPagarGastoFail;
  constructor(public payload: { response: any }) {}
}
export class CancelarPagarGastoSuccess implements Action {
  readonly type = GastosActionTypes.CancelarPagarGastoSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

export type GastosActions =
  | SetGastosFilter
  | LoadGastos
  | LoadGastosFail
  | LoadGastosSuccess
  | UpsertGasto
  | PagarGasto
  | PagarGastoFail
  | PagarGastoSuccess
  | CancelarPagarGasto
  | CancelarPagarGastoFail
  | CancelarPagarGastoSuccess;
