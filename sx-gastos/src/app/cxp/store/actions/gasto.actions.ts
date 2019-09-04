import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { GastoDet } from 'app/cxp/model/gasto-det';

export enum GastoActionTypes {
  LoadGastos = '[Factura Component] Load Gastos ',
  LoadGastosFail = '[Gasto API] Load Gastos fail',
  LoadGastosSuccess = '[Gasto API] Load Gastos success',

  // Create
  CreateGasto = '[Factura Component] Create Gasto',
  CreateGastoFail = '[Factura Component] Create Gasto fail',
  CreateGastoSuccess = '[Factura Component] Create Gasto success',

  // Update
  UpdateGasto = '[Factura Component] Update Gasto',
  UpdateGastoFail = '[Factura Component] Update Gasto fail',
  UpdateGastoSuccess = '[Factura Component] Update Gasto success',

  // Delete
  DeleteGasto = '[Factura Component] Delete Gasto',
  DeleteGastoFail = '[Factura Component] Delete Gasto fail',
  DeleteGastoSuccess = '[Factura Component] Delete Gasto success',

  // Prorratear
  ProrratearPartida = '[Factira Component] ProrratearPartidas',
  ProrratearPartidaFail = '[GastoDet API] ProrratearPartidas Fail',
  ProrratearPartidaSuccess = '[GastoDet API] ProrratearPartidas Success',

  ClearGastos = '[Factura component] Clear gastos'
}

export class LoadGastos implements Action {
  readonly type = GastoActionTypes.LoadGastos;
  public constructor(public payload: { facturaId: string }) {}
}
export class LoadGastosFail implements Action {
  readonly type = GastoActionTypes.LoadGastosFail;
  public constructor(public payload: { response: any }) {}
}
export class LoadGastosSuccess implements Action {
  readonly type = GastoActionTypes.LoadGastosSuccess;
  public constructor(public payload: { gastos: GastoDet[] }) {}
}
// Create
export class CreateGasto implements Action {
  readonly type = GastoActionTypes.CreateGasto;
  public constructor(public payload: { gasto: Partial<GastoDet> }) {}
}
export class CreateGastoFail implements Action {
  readonly type = GastoActionTypes.CreateGastoFail;
  public constructor(public payload: { response: any }) {}
}
export class CreateGastoSuccess implements Action {
  readonly type = GastoActionTypes.CreateGastoSuccess;
  public constructor(public payload: { gasto: GastoDet }) {}
}

// Update
export class UpdateGasto implements Action {
  readonly type = GastoActionTypes.UpdateGasto;
  public constructor(public payload: { gasto: Update<GastoDet> }) {}
}
export class UpdateGastoFail implements Action {
  readonly type = GastoActionTypes.UpdateGastoFail;
  public constructor(public payload: { response: any }) {}
}
export class UpdateGastoSuccess implements Action {
  readonly type = GastoActionTypes.UpdateGastoSuccess;
  public constructor(public payload: { gasto: GastoDet }) {}
}

// Delete
export class DeleteGasto implements Action {
  readonly type = GastoActionTypes.DeleteGasto;
  public constructor(public payload: { gastoId: number }) {}
}
export class DeleteGastoFail implements Action {
  readonly type = GastoActionTypes.DeleteGastoFail;
  public constructor(public payload: { response: any }) {}
}
export class DeleteGastoSuccess implements Action {
  readonly type = GastoActionTypes.DeleteGastoSuccess;
  public constructor(public payload: { gastoId: number }) {}
}
// Prorratear
export class ProrratearPartida implements Action {
  readonly type = GastoActionTypes.ProrratearPartida;
  constructor(public payload: { gastoDetId: number; data: any }) {}
}

export class ProrratearPartidaFail implements Action {
  readonly type = GastoActionTypes.ProrratearPartidaFail;
  constructor(public payload: { response: any }) {}
}

export class ProrratearPartidaSuccess implements Action {
  readonly type = GastoActionTypes.ProrratearPartidaSuccess;
  constructor(public payload: { gastos: GastoDet[] }) {}
}

export class ClearGastos implements Action {
  readonly type = GastoActionTypes.ClearGastos;
}

export type GastoActions =
  | LoadGastos
  | LoadGastosFail
  | LoadGastosSuccess
  | CreateGasto
  | CreateGastoFail
  | CreateGastoSuccess
  | UpdateGasto
  | UpdateGastoFail
  | UpdateGastoSuccess
  | DeleteGasto
  | DeleteGastoFail
  | DeleteGastoSuccess
  | ClearGastos
  | ProrratearPartida
  | ProrratearPartidaFail
  | ProrratearPartidaSuccess;
