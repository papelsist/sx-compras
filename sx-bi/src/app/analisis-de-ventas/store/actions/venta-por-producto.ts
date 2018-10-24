import { Action } from '@ngrx/store';
import { VentaFilter } from 'app/analisis-de-ventas/models/venta-filter';

export enum VentaPorProductoActionTypes {
  LoadVentaPorProducto = '[VentasPorProducto component] Load Venta por producto',
  LoadVentaPorProductoFail = '[Ventas api] Load Venta por producto fail',
  LoadVentaPorProductoSuccess = '[Ventas api] Load Venta por producto Success',
  ClearVentasPorProducto = '[Ventas por producto effect] Clear ventas por producto'
}

export class LoadVentaPorProducto implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProducto;
  constructor(public payload: { origenId: any; filter: VentaFilter }) {}
}
export class LoadVentaPorProductoFail implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProductoFail;
  constructor(public payload: any) {}
}
export class LoadVentaPorProductoSuccess implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProductoSuccess;

  constructor(public payload: any[]) {}
}
export class ClearVentasPorProducto implements Action {
  readonly type = VentaPorProductoActionTypes.ClearVentasPorProducto;
}

export type VentaPorProductoActions =
  | LoadVentaPorProducto
  | LoadVentaPorProductoFail
  | LoadVentaPorProductoSuccess
  | ClearVentasPorProducto;
