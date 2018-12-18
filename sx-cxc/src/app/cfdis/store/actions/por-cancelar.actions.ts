import { Action } from '@ngrx/store';

import { Cfdi } from '../../models';

export enum PorCancelarActionTypes {
  LoadCfdisPorCancelar = '[CfdiPorCancelar Guard] Load CfdiPorCancelar',
  LoadCfdisPorCancelarFail = '[PorCancelars API] Load CfdiPorCancelar fail',
  LoadCfdisPorCancelarSuccess = '[PorCancelars Effects] Load CfdiPorCancelar Success'
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

export type PorCancelarActions =
  | LoadCfdisPorCancelar
  | LoadCfdisPorCancelarFail
  | LoadCfdisPorCancelarSuccess;
