import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { LoadComprasSuccess } from 'app/ordenes/store';

export enum CompraActionTypes {
  SetPeriodo = '[Compras component]Set periodo de compras',
  LoadCompras = '[Compra] Load Compras',
  LoadComprasFail = '[Compra] Load Compras fail',
  LoadComprasSuccess = '[Compra] Load Compras Success',
}

export class SetPeriodo implements Action {
  readonly type = CompraActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadCompras implements Action {
  readonly type = CompraActionTypes.LoadCompras;
}
export class LoadComprasFail implements Action {
  readonly type = CompraActionTypes.LoadComprasFail;
  constructor(public payload: any) {}
}

export type CompraActions =
  | SetPeriodo
  | LoadCompras
  | LoadComprasFail
  | LoadComprasSuccess;
