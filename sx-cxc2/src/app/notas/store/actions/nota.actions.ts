import { Action } from '@ngrx/store';

import { Bonificacion, Devolucion } from 'app/cobranza/models';

export enum NotaActionTypes {
  GenerarCfdi = '[Bonificacion | Devolucion Component] Generar CFDI de NotaDeCredito',
  GenerarCfdiSuccess = '[Bonificacion | Devolucion  Effect] Generar CFDI de NotaDeCredito Success',
  GenerarCfdiFail = '[Bonificacion | Devolucion Effect] Generar CFDI de NotaDeCredito Fail'
}

export class GenerarCfdi implements Action {
  readonly type = NotaActionTypes.GenerarCfdi;
  constructor(public payload: { notaId: string }) {}
}

export class GenerarCfdiSuccess implements Action {
  readonly type = NotaActionTypes.GenerarCfdiSuccess;
  constructor(public payload: { nota: Bonificacion | Devolucion }) {}
}

export class GenerarCfdiFail implements Action {
  readonly type = NotaActionTypes.GenerarCfdiFail;
  constructor(public payload: { response: any }) {}
}

export type NotaActions = GenerarCfdi | GenerarCfdiFail | GenerarCfdiSuccess;
