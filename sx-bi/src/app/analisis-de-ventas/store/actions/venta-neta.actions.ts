import { Action } from '@ngrx/store';

import { VentaAcumulada } from '../../models/ventaAcumulada';

export enum VentaNetaActionTypes {
  LoadVentasNetas = '[VentasNetas component] Load VentasNetas',
  LoadVentasNetasFail = '[Ventas api] Load VentasNetas fail',
  LoadVentasNetasSuccess = '[Ventas api] Load VentasNetas Success',
  SetVentaNetaFilter = '[AnalisisDeVenta Component] Set Venta neta Filter'
}

export class LoadVentasNetas implements Action {
  readonly type = VentaNetaActionTypes.LoadVentasNetas;
}
export class LoadVentasNetasFail implements Action {
  readonly type = VentaNetaActionTypes.LoadVentasNetasFail;
  constructor(public payload: any) {}
}
export class LoadVentasNetasSuccess implements Action {
  readonly type = VentaNetaActionTypes.LoadVentasNetasSuccess;

  constructor(public payload: any[]) {}
}

export class SetVentaNetaFilter implements Action {
  readonly type = VentaNetaActionTypes.SetVentaNetaFilter;
  constructor(public payload: { filter: VentaAcumulada }) {}
}

export type VentaNetaActions =
  | LoadVentasNetas
  | LoadVentasNetasFail
  | LoadVentasNetasSuccess
  | SetVentaNetaFilter;
