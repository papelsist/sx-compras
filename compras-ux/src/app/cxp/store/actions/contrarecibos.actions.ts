import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Contrarecibo } from '../../model';

import { ProveedorPeriodoFilter } from 'app/cxp/model/proveedorPeriodoFilter';

export enum ContrareciboActionTypes {
  LoadContrarecibos = '[Contrarecibos CXP] Load Contrarecibos ',
  LoadContrarecibosFail = '[Contrarecibos CXP] Load Contrarecibos  fail',
  LoadContrarecibosSuccess = '[Contrarecibos CXP] Load Contrarecibos  Success',
  AddContrarecibo = '[Contrarecibos CXP] Add Contrarecibo',
  AddContrareciboFail = '[Contrarecibos CXP] Add Contrarecibo Fail',
  AddContrareciboSuccess = '[Contrarecibos CXP] Add Contrarecibo Success',
  UpsertContrarecibo = '[Contrarecibos CXP] Upsert Contrarecibo',
  UpdateContrarecibo = '[Contrarecibos CXP] Update Contrarecibo',
  UpdateContrareciboFail = '[Contrarecibos CXP] Update Contrarecibo Fail',
  UpdateContrareciboSuccess = '[Contrarecibos CXP] Update Contrarecibo Success',
  DeleteContrarecibo = '[Contrarecibos CXP] Delete Contrarecibo',
  DeleteContrareciboFail = '[Contrarecibos CXP] Delete Contrarecibo Fail',
  DeleteContrareciboSuccess = '[Contrarecibos CXP] Delete Contrarecibo Success',
  ClearContrarecibos = '[Contrarecibos CXP] Clear Contrarecibos',
  SetContrarecibosFilter = '[Contrarecibos component] Set Search term de notas',
  Load = '[Contrarecibos CXP] Load One Contrarecibo',
  LoadFail = '[Contrarecibos CXP] Load One Contrarecibo fail',
  LoadSuccess = '[Contrarecibos CXP] Load One Contrarecibo Success'
}

export class LoadContrarecibos implements Action {
  readonly type = ContrareciboActionTypes.LoadContrarecibos;
}
export class LoadContrarecibosFail implements Action {
  readonly type = ContrareciboActionTypes.LoadContrarecibosFail;
  constructor(public payload: any) {}
}
export class LoadContrarecibosSuccess implements Action {
  readonly type = ContrareciboActionTypes.LoadContrarecibosSuccess;

  constructor(public payload: Contrarecibo[]) {}
}

export class AddContrarecibo implements Action {
  readonly type = ContrareciboActionTypes.AddContrarecibo;
  constructor(public payload: Contrarecibo) {}
}
export class AddContrareciboFail implements Action {
  readonly type = ContrareciboActionTypes.AddContrareciboFail;

  constructor(public payload: any) {}
}
export class AddContrareciboSuccess implements Action {
  readonly type = ContrareciboActionTypes.AddContrareciboSuccess;

  constructor(public payload: Contrarecibo) {}
}

export class UpdateContrarecibo implements Action {
  readonly type = ContrareciboActionTypes.UpdateContrarecibo;

  constructor(public payload: Contrarecibo) {}
}
export class UpdateContrareciboFail implements Action {
  readonly type = ContrareciboActionTypes.UpdateContrareciboFail;

  constructor(public payload: any) {}
}
export class UpdateContrareciboSuccess implements Action {
  readonly type = ContrareciboActionTypes.UpdateContrareciboSuccess;

  constructor(public payload: Contrarecibo) {}
}

export class UpsertContrarecibo implements Action {
  readonly type = ContrareciboActionTypes.UpsertContrarecibo;

  constructor(public payload: { recibo: Contrarecibo }) {}
}

export class DeleteContrarecibo implements Action {
  readonly type = ContrareciboActionTypes.DeleteContrarecibo;

  constructor(public payload: Contrarecibo) {}
}
export class DeleteContrareciboFail implements Action {
  readonly type = ContrareciboActionTypes.DeleteContrareciboFail;

  constructor(public payload: any) {}
}
export class DeleteContrareciboSuccess implements Action {
  readonly type = ContrareciboActionTypes.DeleteContrareciboSuccess;

  constructor(public payload: Contrarecibo) {}
}

export class ClearContrarecibos implements Action {
  readonly type = ContrareciboActionTypes.ClearContrarecibos;
}

export class SetContrarecibosFilter implements Action {
  readonly type = ContrareciboActionTypes.SetContrarecibosFilter;
  constructor(public payload: { filter: ProveedorPeriodoFilter }) {}
}

export type ContrareciboActions =
  | LoadContrarecibos
  | LoadContrarecibosFail
  | LoadContrarecibosSuccess
  | AddContrarecibo
  | AddContrareciboFail
  | AddContrareciboSuccess
  | UpdateContrarecibo
  | UpdateContrareciboFail
  | UpdateContrareciboSuccess
  | UpsertContrarecibo
  | DeleteContrarecibo
  | DeleteContrareciboFail
  | DeleteContrareciboSuccess
  | ClearContrarecibos
  | SetContrarecibosFilter;
