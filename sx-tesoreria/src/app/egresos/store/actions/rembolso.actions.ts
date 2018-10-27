import { Action } from '@ngrx/store';

import { Rembolso, RembolsosFilter } from '../../models';
import { PagoDeRembolso } from 'app/egresos/models/pagoDeRembolso';

export enum RembolsoActionTypes {
  SetRembolsosFilter = '[Rembolsos Component ] Set Rembolsos filter',
  SetRembolsosSearchTerm = '[Rembolsos Component] Set Rembolsos term',

  LoadRembolsos = '[Rembolsos Guard] Load Rembolsos',
  LoadRembolsosFail = '[Rembolso API] Load Rembolsos fail',
  LoadRembolsosSuccess = '[Rembolso API] Load Rembolsos Success',

  PagoRembolso = '[Rembolso Component] Pago Rembolso',
  PagoRembolsoFail = '[Rembolso API] Pago Rembolso Fail',
  PagoRembolsoSuccess = '[Rembolso API] Pago Rembolso Success',

  CancelarPagoRembolso = '[Rembolso Component] CancelarPago Rembolso',
  CancelarPagoRembolsoFail = '[Rembolso API] CancelarPago Rembolso Fail',
  CancelarPagoRembolsoSuccess = '[Rembolso API] CancelarPago Rembolso Success',

  CancelarChequeRembolso = '[Rembolso Component] CancelarCheque Rembolso',
  CancelarChequeRembolsoFail = '[Rembolso API] CancelarCheque Rembolso Fail',
  CancelarChequeRembolsoSuccess = '[Rembolso API] CancelarCheque Rembolso Success',

  GenerarChequeRembolso = '[Rembolso Component] GenerarCheque Rembolso',
  GenerarChequeRembolsoFail = '[Rembolso API] GenerarCheque Rembolso Fail',
  GenerarChequeRembolsoSuccess = '[Rembolso API] GenerarCheque Rembolso Success',

  UpsertRembolso = '[Rembolso exists guard] Upser existing rembolso'
}

export class SetRembolsosFilter implements Action {
  readonly type = RembolsoActionTypes.SetRembolsosFilter;
  constructor(public payload: { filter: RembolsosFilter }) {}
}

export class SetRembolsosSearchTerm implements Action {
  readonly type = RembolsoActionTypes.SetRembolsosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadRembolsos implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsos;
}
export class LoadRembolsosFail implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadRembolsosSuccess implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsosSuccess;

  constructor(public payload: { rembolsos: Rembolso[] }) {}
}

export class PagoRembolso implements Action {
  readonly type = RembolsoActionTypes.PagoRembolso;

  constructor(public payload: { pago: PagoDeRembolso }) {}
}
export class PagoRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.PagoRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class PagoRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.PagoRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}
// Cancelacion de pago
export class CancelarPagoRembolso implements Action {
  readonly type = RembolsoActionTypes.CancelarPagoRembolso;

  constructor(public payload: { rembolso: Rembolso }) {}
}
export class CancelarPagoRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.CancelarPagoRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class CancelarPagoRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.CancelarPagoRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}
// Cancelacion de cheque
export class CancelarChequeRembolso implements Action {
  readonly type = RembolsoActionTypes.CancelarChequeRembolso;

  constructor(public payload: { id: number; comentario: string }) {}
}
export class CancelarChequeRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.CancelarChequeRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class CancelarChequeRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.CancelarChequeRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}

// Generacion de un nuevo cheque
export class GenerarChequeRembolso implements Action {
  readonly type = RembolsoActionTypes.GenerarChequeRembolso;

  constructor(public payload: { rembolso: Rembolso }) {}
}
export class GenerarChequeRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.GenerarChequeRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class GenerarChequeRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.GenerarChequeRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}

export class UpsertRembolso implements Action {
  readonly type = RembolsoActionTypes.UpsertRembolso;
  constructor(public payload: { rembolso: Rembolso }) {}
}

export type RembolsoActions =
  | SetRembolsosFilter
  | SetRembolsosSearchTerm
  | LoadRembolsos
  | LoadRembolsosFail
  | LoadRembolsosSuccess
  | PagoRembolso
  | PagoRembolsoFail
  | PagoRembolsoSuccess
  | CancelarPagoRembolso
  | CancelarPagoRembolsoFail
  | CancelarPagoRembolsoSuccess
  | CancelarChequeRembolso
  | CancelarChequeRembolsoFail
  | CancelarChequeRembolsoSuccess
  | GenerarChequeRembolso
  | GenerarChequeRembolsoFail
  | GenerarChequeRembolsoSuccess
  | UpsertRembolso;
