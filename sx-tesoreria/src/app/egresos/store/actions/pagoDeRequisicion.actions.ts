import { Action } from '@ngrx/store';

import {
  Requisicion,
  RequisicionesFilter,
  CancelacionDeCheque
} from '../../models';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

export enum PagoRequisicionActionTypes {
  PagoRequisicion = '[Pago de requisicion component] Pago de requisicion',
  PagoRequisicionFail = '[Pago de requisicion API] Pago de fail',
  PagoRequisicionSuccess = '[Pago de requisicion API] Pago de success',

  // Cancelar pago
  CancelarPagoRequisicion = '[Pago de requisicion component] Cancelar pago de requisicion',
  CancelarPagoRequisicionFail = '[Pago de requisicion API] Cancelar pago de fail',
  CancelarPagoRequisicionSuccess = '[Pago de requisicion API] Cancelra pago de success',

  // Generar cheque
  GenerarCheque = '[Pago de requisicion component] Generar cheque',

  // Cancelar cheque
  CancelarCheque = '[Pago de requisicion component] Cancelar  cheque',
  CancelarChequeFail = '[Pago de requisicion API] Cancelar cheque fail',
  CancelarChequeSuccess = '[Pago de requisicion API] Cancelra cheque de success'
}

// Pagar
export class PagoRequisicion implements Action {
  readonly type = PagoRequisicionActionTypes.PagoRequisicion;
  constructor(public payload: { pago: PagoDeRequisicion }) {}
}
export class PagoRequisicionFail implements Action {
  readonly type = PagoRequisicionActionTypes.PagoRequisicionFail;
  constructor(public payload: { response: any }) {}
}
export class PagoRequisicionSuccess implements Action {
  readonly type = PagoRequisicionActionTypes.PagoRequisicionSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

export class GenerarCheque implements Action {
  readonly type = PagoRequisicionActionTypes.GenerarCheque;
  constructor(
    public payload: { requisicion: Requisicion; referencia: string }
  ) {}
}

// Cancelar pago
export class CancelarPagoRequisicion implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarPagoRequisicion;
  constructor(public payload: { requisicion: Requisicion }) {}
}
export class CancelarPagoRequisicionFail implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarPagoRequisicionFail;
  constructor(public payload: { response: any }) {}
}
export class CancelarPagoRequisicionSuccess implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarPagoRequisicionSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

// Cancelar cheque
export class CancelarCheque implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarCheque;
  constructor(public payload: { cancelacion: CancelacionDeCheque }) {}
}
export class CancelarChequeFail implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarChequeFail;
  constructor(public payload: { response: any }) {}
}
export class CancelarChequeSuccess implements Action {
  readonly type = PagoRequisicionActionTypes.CancelarChequeSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

export type PagoRequisicionActions =
  | PagoRequisicion
  | PagoRequisicionFail
  | PagoRequisicionSuccess
  | CancelarPagoRequisicion
  | CancelarPagoRequisicionFail
  | CancelarPagoRequisicionSuccess
  | GenerarCheque
  | CancelarCheque
  | CancelarChequeFail
  | CancelarChequeSuccess;
