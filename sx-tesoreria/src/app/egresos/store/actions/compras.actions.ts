import { Action } from '@ngrx/store';

import { Requisicion, RequisicionesFilter } from '../../models';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

export enum ComprasActionTypes {
  SetComprasFilter = '[Compras component] Set requisiciones filter',

  LoadCompras = '[Compras component] Load requsiciones',
  LoadComprasFail = '[Compras API] Load requsiciones Fail',
  LoadComprasSuccess = '[Compras API] Load requsiciones Success',

  UpsertCompra = '[ Compra exists guard] Upsert compra',

  PagarCompra = '[Compra compponent] Pagar compra',
  PagarCompraFail = '[Compra API] Pagar fail',
  PagarCompraSuccess = '[Compra API] Pagar success'
}

export class SetComprasFilter implements Action {
  readonly type = ComprasActionTypes.SetComprasFilter;
  constructor(public payload: { filter: RequisicionesFilter }) {}
}

export class LoadCompras implements Action {
  readonly type = ComprasActionTypes.LoadCompras;
}
export class LoadComprasFail implements Action {
  readonly type = ComprasActionTypes.LoadComprasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadComprasSuccess implements Action {
  readonly type = ComprasActionTypes.LoadComprasSuccess;
  constructor(public payload: { requisiciones: Requisicion[] }) {}
}

export class UpsertCompra implements Action {
  readonly type = ComprasActionTypes.UpsertCompra;
  constructor(public payload: { requisicion: Requisicion }) {}
}

// Pagar
export class PagarCompra implements Action {
  readonly type = ComprasActionTypes.PagarCompra;
  constructor(public payload: { pago: PagoDeRequisicion }) {}
}
export class PagarCompraFail implements Action {
  readonly type = ComprasActionTypes.PagarCompraFail;
  constructor(public payload: { response: any }) {}
}
export class PagarCompraSuccess implements Action {
  readonly type = ComprasActionTypes.PagarCompraSuccess;
  constructor(public payload: { requisicion: Requisicion }) {}
}

export type ComprasActions =
  | SetComprasFilter
  | LoadCompras
  | LoadComprasFail
  | LoadComprasSuccess
  | UpsertCompra
  | PagarCompra
  | PagarCompraFail
  | PagarCompraSuccess;
