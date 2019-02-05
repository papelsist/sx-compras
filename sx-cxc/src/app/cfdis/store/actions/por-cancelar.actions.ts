import { Action } from '@ngrx/store';

import { Cfdi, CfdiCancelado } from '../../models';

export enum PorCancelarActionTypes {
  LoadCfdisPorCancelar = '[CfdiPorCancelar Guard] Load CfdiPorCancelar',
  LoadCfdisPorCancelarFail = '[PorCancelars API] Load CfdiPorCancelar fail',
  LoadCfdisPorCancelarSuccess = '[PorCancelars Effects] Load CfdiPorCancelar Success',
  CancelarCfdi = '[PorCancelar component] Cancelar CFDI',
  CancelarCfdiFail = '[PorCancelar effects API] Cancelar CFDI Fail',
  CancelarCfdiSuccess = '[PorCancelar component] Cancelar CFDI Success'
}

export class LoadCfdisPorCancelar implements Action {
  readonly type = PorCancelarActionTypes.LoadCfdisPorCancelar;
}
export class LoadCfdisPorCancelarFail implements Action {
  readonly type = PorCancelarActionTypes.LoadCfdisPorCancelarFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCfdisPorCancelarSuccess implements Action {
  readonly type = PorCancelarActionTypes.LoadCfdisPorCancelarSuccess;
  constructor(public payload: { pendientes: Cfdi[] }) {}
}

export class CancelarCfdi implements Action {
  readonly type = PorCancelarActionTypes.CancelarCfdi;
  constructor(public payload: { cfdi: Cfdi }) {}
}
export class CancelarCfdiFail implements Action {
  readonly type = PorCancelarActionTypes.CancelarCfdiFail;
  constructor(public payload: { response: any }) {}
}
export class CancelarCfdiSuccess implements Action {
  readonly type = PorCancelarActionTypes.CancelarCfdiSuccess;
  constructor(public payload: { cancelacion: CfdiCancelado }) {}
}

export type PorCancelarActions =
  | LoadCfdisPorCancelar
  | LoadCfdisPorCancelarFail
  | LoadCfdisPorCancelarSuccess
  | CancelarCfdi
  | CancelarCfdiFail
  | CancelarCfdiSuccess;
