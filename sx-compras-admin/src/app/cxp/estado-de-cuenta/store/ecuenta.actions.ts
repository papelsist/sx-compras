import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { Proveedor } from 'app/proveedores/models/proveedor';

export enum EstadoDeCuentaActionTypes {
  SetProveedor = '[Estado de cuenta component] Set Proveedor ',
  SetPeriodo = '[Estado de cuenta component] Set Periodo '
}

export class SetProveedor implements Action {
  readonly type = EstadoDeCuentaActionTypes.SetProveedor;
  constructor(public payload: { proveedor: Proveedor }) {}
}
export class SetPeriodo implements Action {
  readonly type = EstadoDeCuentaActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export type EstadoDeCuentaActions = SetProveedor | SetPeriodo;
