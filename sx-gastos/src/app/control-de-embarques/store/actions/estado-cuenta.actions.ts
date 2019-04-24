import { Action } from '@ngrx/store';
import {
  FacturistaDeEmbarque,
  FacturistaEstadoDeCuenta
} from 'app/control-de-embarques/model';

export enum EstadoDeCuentaActionTypes {
  SetFacturista = '[Estado de cuenta component] Set Facturista',
  LoadEstadoDeCuenta = '[Estado de cuenta Effects] Load estado de cuenta',
  LoadEstadoDeCuentaFail = '[Estado de cuenta Effects] Load estado de cuenta fail',
  LoadEstadoDeCuentaSuccess = '[Estado de cuenta Effects] Load estado de cuenta success',
  GenerarIntereses = '[Estado de cuenta component] Generar intereses',
  GenerarInteresesFail = '[Estado de cuenta effect API] Generar intereses fail',
  GenerarInteresesSuccess = '[Estado de cuenta effect API] Generar intereses success',
  GenerarNotaDeCargo = '[Estado de cuenta component] Generar nota de cargo por intereses',
  GenerarNotaDeCargoFail = '[Estado de cuenta effect API] Generar nota de cargo por intereses fail',
  GenerarNotaDeCargoSuccess = '[Estado de cuenta effect API] Generar nota de cargo por intereses  success'
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

export class GenerarIntereses implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarIntereses;
  constructor(
    public payload: {
      corte: string;
      tasa: number;
      facturista?: string;
    }
  ) {}
}
export class GenerarInteresesFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarInteresesFail;
  constructor(public payload: { response: any }) {}
}
export class GenerarInteresesSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarInteresesSuccess;
  constructor(public payload: { response: any }) {}
}

export class GenerarNotaDeCargo implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarNotaDeCargo;
  constructor(public payload: { facturistaId: string }) {}
}
export class GenerarNotaDeCargoFail implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarNotaDeCargoFail;
  constructor(public payload: { response: any }) {}
}
export class GenerarNotaDeCargoSuccess implements Action {
  readonly type = EstadoDeCuentaActionTypes.GenerarNotaDeCargoSuccess;
  constructor(public payload: { response: any }) {}
}

export type EstadoDeCuentaActions =
  | SetFacturista
  | LoadEstadoDeCuenta
  | LoadEstadoDeCuentaFail
  | LoadEstadoDeCuentaSuccess
  | GenerarIntereses
  | GenerarInteresesFail
  | GenerarInteresesSuccess
  | GenerarNotaDeCargo
  | GenerarNotaDeCargoFail
  | GenerarNotaDeCargoSuccess;
