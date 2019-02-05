import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Cfdi, CfdisFilter } from '../../models';

export enum CfdiActionTypes {
  LoadCfdis = '[CFDI] Load Cfdis',
  LoadCfdisFail = '[CFDI] Load Cfdis fail',
  LoadCfdisSuccess = '[CFDI] Load Cfdis Success',
  ClearCfdis = '[CFDI] Clear Cfdis',
  ImprimirCfdi = '[CFDI] Imprimir Cfdi',
  MostrarXmlDelCfdi = '[CFDI] Mostrar XML del Cfdi',
  SetCfdisFilter = '[CFDI] Set CFDIs Filter',
  SetCfdisSearchTerm = '[CFDI] CFDIs SearchTerm Cfdi'
}

export class LoadCfdis implements Action {
  readonly type = CfdiActionTypes.LoadCfdis;
}
export class LoadCfdisFail implements Action {
  readonly type = CfdiActionTypes.LoadCfdisFail;
  constructor(public payload: any) {}
}
export class LoadCfdisSuccess implements Action {
  readonly type = CfdiActionTypes.LoadCfdisSuccess;
  constructor(public payload: { cfdis: Cfdi[] }) {}
}

export class ClearCfdis implements Action {
  readonly type = CfdiActionTypes.ClearCfdis;
}

export class ImprimirCfdi implements Action {
  readonly type = CfdiActionTypes.ImprimirCfdi;
  constructor(public payload: string) {}
}

export class MostrarXmlCfdi implements Action {
  readonly type = CfdiActionTypes.MostrarXmlDelCfdi;
  constructor(public payload: { cfdi: Partial<Cfdi> }) {}
}

export class SetCfdiFilter implements Action {
  readonly type = CfdiActionTypes.SetCfdisFilter;
  constructor(public payload: { filter: CfdisFilter }) {}
}

export class SetCfdisSearchTerm implements Action {
  readonly type = CfdiActionTypes.SetCfdisSearchTerm;
  constructor(public payload: { term: string }) {}
}

export type CfdiActions =
  | LoadCfdis
  | LoadCfdisFail
  | LoadCfdisSuccess
  | ClearCfdis
  | ImprimirCfdi
  | MostrarXmlCfdi
  | SetCfdiFilter
  | SetCfdisSearchTerm;
