import { Action } from '@ngrx/store';

import { DevolucionCliente } from '../../models';
import { PeriodoFilter } from 'app/models';

export enum DevolucionClienteActionTypes {
  SetDevolucionClientesFilter = '[Devolucion de clientes Component ] Set DevolucionCliente filter',

  LoadDevoluciones = '[DevolucionesCliente Guard] Load Devoluciones',
  LoadDevolucionesSuccess = '[DevolucionCliente API] Load Devoluciones Success',

  CreateDevolucionCliente = '[Devolucion de cliente Component] DevolucionCliente create',
  CreateDevolucionClienteSuccess = '[DevolucionCliente API] DevolucionCliente  Success',

  DeleteDevolucionCliente = '[Devolucion de clientes Component] Delete DevolucionCliente',
  DeleteDevolucionClienteSuccess = '[DevolucionCliente API] Delete DevolucionCliente Success',

  UpsertDevolucionCliente = '[DevolucionCliente exists guard] Upsert DevolucionCliente',

  DevolucionClienteError = '[DevolucionCliente API] DevolucionCliente Http Error'
}

// Filters
export class SetDevolucionClientesFilter implements Action {
  readonly type = DevolucionClienteActionTypes.SetDevolucionClientesFilter;
  constructor(public payload: { filter: PeriodoFilter }) {}
}

// Load
export class LoadDevoluciones implements Action {
  readonly type = DevolucionClienteActionTypes.LoadDevoluciones;
}
export class LoadDevolucionesSuccess implements Action {
  readonly type = DevolucionClienteActionTypes.LoadDevolucionesSuccess;

  constructor(public payload: { devoluciones: DevolucionCliente[] }) {}
}

// Alta
export class CreateDevolucionCliente implements Action {
  readonly type = DevolucionClienteActionTypes.CreateDevolucionCliente;
  constructor(public payload: { devolucion: DevolucionCliente }) {}
}
export class CreateDevolucionClienteSuccess implements Action {
  readonly type = DevolucionClienteActionTypes.CreateDevolucionClienteSuccess;
  constructor(public payload: { devolucion: DevolucionCliente }) {}
}

// Bajas
export class DeleteDevolucionCliente implements Action {
  readonly type = DevolucionClienteActionTypes.DeleteDevolucionCliente;

  constructor(public payload: { devolucion: DevolucionCliente }) {}
}
export class DeleteDevolucionClienteSuccess implements Action {
  readonly type = DevolucionClienteActionTypes.DeleteDevolucionClienteSuccess;

  constructor(public payload: { devolucion: DevolucionCliente }) {}
}

// Errors
export class DevolucionClienteError implements Action {
  readonly type = DevolucionClienteActionTypes.DevolucionClienteError;
  constructor(public payload: { response: any }) {}
}

export class UpsertDevolucionCliente implements Action {
  readonly type = DevolucionClienteActionTypes.UpsertDevolucionCliente;
  constructor(public payload: { devolucion: DevolucionCliente }) {}
}

export type DevolucionClienteActions =
  | SetDevolucionClientesFilter
  | LoadDevoluciones
  | LoadDevolucionesSuccess
  | CreateDevolucionCliente
  | CreateDevolucionClienteSuccess
  | DeleteDevolucionCliente
  | DeleteDevolucionClienteSuccess
  | DevolucionClienteError
  | UpsertDevolucionCliente;
