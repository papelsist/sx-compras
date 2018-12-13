import { Action } from '@ngrx/store';

import { EstadoDeCuenta } from 'app/cuentas/models/estado-de-cuenta';
import { CuentaDeBanco } from 'app/models';
import { Periodo } from 'app/_core/models/periodo';

export enum EstadoDeCuentaActionTypes {
  GetEstado = '[Estado de cuenta component] Get estado de cuenta',
  GetEstadoFail = '[Estado de cuenta API effect] Get estado de cuenta fail',
  GetEstadoSuccess = '[Estado de cuenta API effect] Get estado de cuenta Success'
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

export type EstadoDeCuentaActions =
  | GetEstado
  | GetEstadoFail
  | GetEstadoSuccess;
