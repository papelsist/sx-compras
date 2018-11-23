import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ComprobanteFiscal, CfdisFilter } from '../../model';

export enum ComprobanteActionTypes {
  LoadComprobantes = '[CFDI] Load Comprobantes',
  LoadComprobantesFail = '[CFDI] Load Comprobantes fail',
  LoadComprobantesSuccess = '[CFDI] Load Comprobantes Success',
  UpdateComprobante = '[CFDI] Update Comprobante',
  UpdateComprobanteFail = '[CFDI] Update Comprobante Fail',
  UpdateComprobanteSuccess = '[CFDI] Update Comprobante Success',
  ClearComprobantes = '[CFDI] Clear Comprobantes',
  ImprimirComprobante = '[CFDI] Imprimir Comprobante',
  MostrarXmlDelComprobante = '[CFDI] Mostrar XML del Comprobante',
  SetCfdisFilter = '[CFDI] Set CFDIs Filter',
  SetCfdisSearchTerm = '[CFDI] CFDIs SearchTerm Comprobante',
  SelectCfdis = '[CFDI] Select cfdis Comprobante'
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

export class ClearComprobantes implements Action {
  readonly type = ComprobanteActionTypes.ClearComprobantes;
}

export class ImprimirComprobante implements Action {
  readonly type = ComprobanteActionTypes.ImprimirComprobante;

  constructor(public payload: string) {}
}
export class MostrarXmlComprobante implements Action {
  readonly type = ComprobanteActionTypes.MostrarXmlDelComprobante;

  constructor(public payload: { cfdi: Partial<ComprobanteFiscal> }) {}
}

export class SetCfdiFilter implements Action {
  readonly type = ComprobanteActionTypes.SetCfdisFilter;

  constructor(public payload: { filter: CfdisFilter }) {}
}

export class SetCfdisSearchTerm implements Action {
  readonly type = ComprobanteActionTypes.SetCfdisSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class SelectCfdis implements Action {
  readonly type = ComprobanteActionTypes.SelectCfdis;
  constructor(public payload: { ids: string[] }) {}
}

export type ComprobanteActions =
  | LoadComprobantes
  | LoadComprobantesFail
  | LoadComprobantesSuccess
  | UpdateComprobante
  | UpdateComprobanteFail
  | UpdateComprobanteSuccess
  | ClearComprobantes
  | ImprimirComprobante
  | MostrarXmlComprobante
  | SetCfdiFilter
  | SetCfdisSearchTerm
  | SelectCfdis;
