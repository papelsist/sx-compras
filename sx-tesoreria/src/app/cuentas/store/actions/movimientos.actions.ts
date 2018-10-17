import { Action } from '@ngrx/store';

import { Movimiento } from '../../models/movimiento';
import { CuentaDeBanco } from 'app/models';

export enum MovimientoActionTypes {
  LoadMovimientos = '[Movimientos component] Load Movimientos',
  LoadMovimientosFail = '[Movimientos API effect] Load Movimientos fail',
  LoadMovimientosSuccess = '[Movimientos API effect] Load Movimientos Success'
}

export class LoadMovimientos implements Action {
  readonly type = MovimientoActionTypes.LoadMovimientos;
  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}
export class LoadMovimientosFail implements Action {
  readonly type = MovimientoActionTypes.LoadMovimientosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadMovimientosSuccess implements Action {
  readonly type = MovimientoActionTypes.LoadMovimientosSuccess;

  constructor(public payload: { movimientos: Movimiento[] }) {}
}

export type MovimientoActions =
  | LoadMovimientos
  | LoadMovimientosFail
  | LoadMovimientosSuccess;
