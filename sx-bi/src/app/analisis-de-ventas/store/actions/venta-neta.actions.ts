import { Action } from '@ngrx/store';

import { VentaFilter } from '../../models/venta-filter';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';

export enum VentaNetaActionTypes {
  LoadVentasNetas = '[VentasNetas component] Load VentasNetas',
  LoadVentasNetasFail = '[Ventas api] Load VentasNetas fail',
  LoadVentasNetasSuccess = '[Ventas api] Load VentasNetas Success',
  SetSelectedVenta = '[Venta neta component] Set selected row',
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

  constructor(public payload: VentaNeta[]) {}
}

export class SetSelectedVenta implements Action {
  readonly type = VentaNetaActionTypes.SetSelectedVenta;
  constructor(public payload: { selected: VentaNeta }) {}
}

export class SetVentaNetaFilter implements Action {
  readonly type = VentaNetaActionTypes.SetVentaNetaFilter;
  constructor(public payload: { filter: VentaFilter }) {}
}

export type VentaNetaActions =
  | LoadVentasNetas
  | LoadVentasNetasFail
  | LoadVentasNetasSuccess
  | SetSelectedVenta
  | SetVentaNetaFilter;
