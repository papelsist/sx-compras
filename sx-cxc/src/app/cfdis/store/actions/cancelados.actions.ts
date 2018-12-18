import { Action } from '@ngrx/store';

import { CfdiCancelado, CfdisFilter, Cfdi } from '../../models';

export enum CfdiCanceladoActionTypes {
  LoadCfdisCancelados = '[CfdiCancelados Guard] Load CfdiCancelados',
  LoadCfdisCanceladosFail = '[CfdiCancelados API] Load CfdiCancelados fail',
  LoadCfdisCanceladosSuccess = '[CfdiCancelados API] Load CfdiCancelados Success',
  SetCfdisCanceladosFilter = '[CfdiCancelados component] Set CfdiCancelados Filter',
  SetCfdisCanceladosSearchTerm = '[CfdiCancelado component] CFDIs cancelado SearchTerm'
}

export class LoadCfdisCancelados implements Action {
  readonly type = CfdiCanceladoActionTypes.LoadCfdisCancelados;
}
export class LoadCfdisCanceladosFail implements Action {
  readonly type = CfdiCanceladoActionTypes.LoadCfdisCanceladosFail;
  constructor(public payload: any) {}
}
export class LoadCfdisCanceladosSuccess implements Action {
  readonly type = CfdiCanceladoActionTypes.LoadCfdisCanceladosSuccess;
  constructor(public payload: { cancelados: CfdiCancelado[] }) {}
}

export class SetCfdisCanceladosFilter implements Action {
  readonly type = CfdiCanceladoActionTypes.SetCfdisCanceladosFilter;
  constructor(public payload: { filter: CfdisFilter }) {}
}

export class SetCfdisCanceladosSearchTerm implements Action {
  readonly type = CfdiCanceladoActionTypes.SetCfdisCanceladosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export type CfdiCanceladoActions =
  | LoadCfdisCancelados
  | LoadCfdisCanceladosFail
  | LoadCfdisCanceladosSuccess
  | SetCfdisCanceladosFilter
  | SetCfdisCanceladosSearchTerm;
