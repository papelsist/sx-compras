import { Action } from '@ngrx/store';

import { VentaAcumulada } from '../../models/ventaAcumulada';

export enum VentaPorProductoActionTypes {
  LoadVentaPorProducto = '[VentasPorProducto component] Load Venta por producto',
  LoadVentaPorProductoFail = '[Ventas api] Load Venta por producto fail',
  LoadVentaPorProductoSuccess = '[Ventas api] Load Venta por producto Success'
}

export class LoadVentaPorProducto implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProducto;
}
export class LoadVentaPorProductoFail implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProductoFail;
  constructor(public payload: any) {}
}
export class LoadVentaPorProductoSuccess implements Action {
  readonly type = VentaPorProductoActionTypes.LoadVentaPorProductoSuccess;

  constructor(public payload: any[]) {}
}

export type VentaPorProductoActions =
  | LoadVentaPorProducto
  | LoadVentaPorProductoFail
  | LoadVentaPorProductoSuccess;
