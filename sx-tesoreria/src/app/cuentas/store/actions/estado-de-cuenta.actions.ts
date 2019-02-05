import { Action } from '@ngrx/store';

import { EstadoDeCuenta } from 'app/cuentas/models/estado-de-cuenta';
import { CuentaDeBanco } from 'app/models';
import { Periodo } from 'app/_core/models/periodo';
import { EjercicioMes } from 'app/models/ejercicioMes';

export enum EstadoDeCuentaActionTypes {
  GetEstado = '[Estado de cuenta component] Get estado de cuenta',
  GetEstadoFail = '[Estado de cuenta API effect] Get estado de cuenta fail',
  GetEstadoSuccess = '[Estado de cuenta API effect] Get estado de cuenta Success',
  // Cerrar la cuenta para el periodo
  CerrarCuenta = '[Estado de cuenta component] Cerrar cuenta',
  CerrarCuentaFail = '[Estado de cuenta API effect] Cerrar cuenta fail',
  CerrarCuentaSuccess = '[Estado de cuenta API effect] Cerrar cuenta Success'
}

export class GetEstado implements Action {
  readonly type = EstadoDeCuentaActionTypes.GetEstado;
  constructor(
    public payload: { cuenta: Partial<CuentaDeBanco>; periodo: Periodo }
  ) {}
}
export class GetEstadoFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.GetEstadoFail;
  constructor(public payload: { response: any }) {}
}
export class GetEstadoSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.GetEstadoSuccess;

  constructor(public payload: { estadoDeCuenta: EstadoDeCuenta }) {}
}

export class CerrarCuenta implements Action {
  readonly type = EstadoDeCuentaActionTypes.CerrarCuenta;
  constructor(
    public payload: { cuenta: Partial<CuentaDeBanco>; periodo: EjercicioMes }
  ) {}
}
export class CerrarCuentaFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.CerrarCuentaFail;
  constructor(public payload: { response: any }) {}
}
export class CerrarCuentaSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.CerrarCuentaSuccess;
  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}

export type EstadoDeCuentaActions =
  | GetEstado
  | GetEstadoFail
  | GetEstadoSuccess
  | CerrarCuenta
  | CerrarCuentaFail
  | CerrarCuentaSuccess;
