import { Action } from '@ngrx/store';
import {
  FacturistaDeEmbarque,
  FacturistaEstadoDeCuenta
} from 'app/control-de-embarques/model';

export enum EstadoDeCuentaActionTypes {
  SetFacturista = '[Estado de cuenta component] Set Facturista',
  LoadEstadoDeCuenta = '[Estado de cuenta Effects] Load estado de cuenta',
  LoadEstadoDeCuentaFail = '[Estado de cuenta Effects] Load estado de cuenta fail',
  LoadEstadoDeCuentaSuccess = '[Estado de cuenta Effects] Load estado de cuenta success'
}

export class SetFacturista implements Action {
  readonly type = EstadoDeCuentaActionTypes.SetFacturista;
  constructor(public payload: { facturista: FacturistaDeEmbarque }) {}
}

export class LoadEstadoDeCuenta implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuenta;
  constructor(public payload: { facturistaId: string }) {}
}

export class LoadEstadoDeCuentaFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaFail;
  constructor(public payload: { response: any }) {}
}
export class LoadEstadoDeCuentaSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.LoadEstadoDeCuentaSuccess;
  constructor(public payload: { rows: FacturistaEstadoDeCuenta[] }) {}
}

export type EstadoDeCuentaActions =
  | SetFacturista
  | LoadEstadoDeCuenta
  | LoadEstadoDeCuentaFail
  | LoadEstadoDeCuentaSuccess;
