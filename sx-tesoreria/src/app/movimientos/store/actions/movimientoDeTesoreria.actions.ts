import { Action } from '@ngrx/store';

import { MovimientoDeTesoreria } from '../../models';
import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

export enum MovimientoActionTypes {
  SetMovimientosFilter = '[MovimientoDeTesoreria Component ] Set Movimientos filter',

  LoadMovimientos = '[MovimientosDeTesoreria Guard] Load Movimientos',
  LoadMovimientosSuccess = '[Movimiento API] Load Movimientos Success',

  CreateMovimiento = '[Movimiento Component] Create Movimiento',
  CreateMovimientoSuccess = '[Movimiento API] Create Movimiento Success',

  UpdateMovimiento = '[Movimiento Component] Update Movimiento',
  UpdateMovimientoSuccess = '[Movimiento API] Update Movimiento Success',

  DeleteMovimiento = '[Movimiento Component] Delete Movimiento',
  DeleteMovimientoSuccess = '[Movimiento API] Delete Movimiento Success',

  UpsertMovimiento = '[Movimiento exists guard] Upser existing movimiento',
  MovimientoError = '[Movimiento API] Movimiento Http Error'
}

// Filters
export class SetMovimientosFilter implements Action {
  readonly type = MovimientoActionTypes.SetMovimientosFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

// Load
export class LoadMovimientos implements Action {
  readonly type = MovimientoActionTypes.LoadMovimientos;
}
export class LoadMovimientosSuccess implements Action {
  readonly type = MovimientoActionTypes.LoadMovimientosSuccess;

  constructor(public payload: { movimientos: MovimientoDeTesoreria[] }) {}
}

// Create
export class CreateMovimiento implements Action {
  readonly type = MovimientoActionTypes.CreateMovimiento;

  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}
export class CreateMovimientoSuccess implements Action {
  readonly type = MovimientoActionTypes.CreateMovimientoSuccess;

  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}
// Delete
export class DeleteMovimiento implements Action {
  readonly type = MovimientoActionTypes.DeleteMovimiento;

  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}
export class DeleteMovimientoSuccess implements Action {
  readonly type = MovimientoActionTypes.DeleteMovimientoSuccess;

  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}
// Update
export class UpdateMovimiento implements Action {
  readonly type = MovimientoActionTypes.UpdateMovimiento;

  constructor(public payload: { update: Update<MovimientoDeTesoreria> }) {}
}
export class UpdateMovimientoSuccess implements Action {
  readonly type = MovimientoActionTypes.UpdateMovimientoSuccess;

  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}

// Upsert
export class UpsertMovimiento implements Action {
  readonly type = MovimientoActionTypes.UpsertMovimiento;
  constructor(public payload: { movimiento: MovimientoDeTesoreria }) {}
}

// Errors
export class MovimientoError implements Action {
  readonly type = MovimientoActionTypes.MovimientoError;
  constructor(public payload: { response: any }) {}
}

export type MovimientoActions =
  | SetMovimientosFilter
  | LoadMovimientos
  | LoadMovimientosSuccess
  | CreateMovimiento
  | CreateMovimientoSuccess
  | DeleteMovimiento
  | DeleteMovimientoSuccess
  | UpdateMovimiento
  | UpdateMovimientoSuccess
  | MovimientoError
  | UpsertMovimiento;
