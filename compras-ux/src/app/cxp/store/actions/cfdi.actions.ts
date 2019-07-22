import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ComprobanteFiscal } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

export enum ComprobanteActionTypes {
  LoadComprobantes = '[CFDI] Load Comprobantes',
  LoadComprobantesFail = '[CFDI] Load Comprobantes fail',
  LoadComprobantesSuccess = '[CFDI] Load Comprobantes Success',
  UpsertComprobante = '[CFDI] Upsert Comprobante',
  UpdateComprobante = '[CFDI] Update Comprobante',
  UpdateComprobanteFail = '[CFDI] Update Comprobante Fail',
  UpdateComprobanteSuccess = '[CFDI] Update Comprobante Success',
  ClearComprobantes = '[CFDI] Clear Comprobantes',
  ImprimirComprobante = '[CFDI] Imprimir Comprobante',
  MostrarXmlDelComprobante = '[CFDI] Mostrar XML del Comprobante'
}

export class LoadComprobantes implements Action {
  readonly type = ComprobanteActionTypes.LoadComprobantes;
}
export class LoadComprobantesFail implements Action {
  readonly type = ComprobanteActionTypes.LoadComprobantesFail;
  constructor(public payload: any) {}
}
export class LoadComprobantesSuccess implements Action {
  readonly type = ComprobanteActionTypes.LoadComprobantesSuccess;

  constructor(public payload: ComprobanteFiscal[]) {}
}

export class UpdateComprobante implements Action {
  readonly type = ComprobanteActionTypes.UpdateComprobante;

  constructor(public payload: ComprobanteFiscal) {}
}
export class UpdateComprobanteFail implements Action {
  readonly type = ComprobanteActionTypes.UpdateComprobanteFail;

  constructor(public payload: any) {}
}
export class UpdateComprobanteSuccess implements Action {
  readonly type = ComprobanteActionTypes.UpdateComprobanteSuccess;

  constructor(public payload: ComprobanteFiscal) {}
}

export class UpsertComprobante implements Action {
  readonly type = ComprobanteActionTypes.UpsertComprobante;

  constructor(public payload: { comprobante: ComprobanteFiscal }) {}
}

export class ClearComprobantes implements Action {
  readonly type = ComprobanteActionTypes.ClearComprobantes;
}

export class ImprimirComprobante implements Action {
  readonly type = ComprobanteActionTypes.ImprimirComprobante;

  constructor(public payload: string) {}
}
export class MostrarXmlComprobante implements Action {
  readonly type = ComprobanteActionTypes.MostrarXmlDelComprobante;

  constructor(public payload: string) {}
}

export type ComprobanteActions =
  | LoadComprobantes
  | LoadComprobantesFail
  | LoadComprobantesSuccess
  | UpdateComprobante
  | UpdateComprobanteFail
  | UpdateComprobanteSuccess
  | UpsertComprobante
  | ClearComprobantes
  | ImprimirComprobante
  | MostrarXmlComprobante;
