import { Action } from '@ngrx/store';

import { Cobro, Cartera, CarteraFilter } from '../../models';

export enum CobroActionTypes {
  SetCobrosSearchTerm = '[Cobros Component] Set Cobros term',
  LoadCobros = '[Cobros Guard] Load Cobros',
  LoadCobrosFail = '[Cobro API] Load Cobros fail',
  LoadCobrosSuccess = '[Cobro API] Load Cobros Success',

  UpsertCobro = '[Cobro-Exists Guard] UpserCobro',
  RegistrarAplicaciones = '[Cobro Component] Registrar aplicaciones',
  RegistrarAplicacionesFail = '[Cobro Effects] Registrar aplicciones fail',
  RegistrarAplicacionesSuccess = '[Cobro Effects] Registrar aplicaciones success',
  EliminarAplicacion = '[Cobro Component] Eliminar aplicacion',
  EliminarAplicacionFail = '[Cobro Effects] Eliminar apliccion fail',
  EliminarAplicacionSuccess = '[Cobro Effects] Eliminar aplicacion success'
}

export class SetCobrosSearchTerm implements Action {
  readonly type = CobroActionTypes.SetCobrosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadCobros implements Action {
  readonly type = CobroActionTypes.LoadCobros;
  constructor(public payload: { cartera: Cartera; filter?: CarteraFilter }) {}
}
export class LoadCobrosFail implements Action {
  readonly type = CobroActionTypes.LoadCobrosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadCobrosSuccess implements Action {
  readonly type = CobroActionTypes.LoadCobrosSuccess;

  constructor(public payload: { cobros: Cobro[] }) {}
}

export class UpsertCobro implements Action {
  readonly type = CobroActionTypes.UpsertCobro;
  constructor(public payload: { cobro: Cobro }) {}
}

export class RegistrarAplicaciones implements Action {
  readonly type = CobroActionTypes.RegistrarAplicaciones;
  constructor(
    public payload: {
      cobroId: string;
      facturas: string[];
    }
  ) {}
}
export class RegistrarAplicacionesFail implements Action {
  readonly type = CobroActionTypes.RegistrarAplicacionesFail;
  constructor(public payload: { response: any }) {}
}
export class RegistrarAplicacionesSuccess implements Action {
  readonly type = CobroActionTypes.RegistrarAplicacionesSuccess;
  constructor(public payload: { cobro: Cobro }) {}
}

export class EliminarAplicacion implements Action {
  readonly type = CobroActionTypes.EliminarAplicacion;
  constructor(
    public payload: {
      aplicationId: string;
    }
  ) {}
}
export class EliminarAplicacionFail implements Action {
  readonly type = CobroActionTypes.EliminarAplicacionFail;
  constructor(public payload: { response: any }) {}
}
export class EliminarAplicacionSuccess implements Action {
  readonly type = CobroActionTypes.EliminarAplicacionSuccess;
  constructor(public payload: { cobro: Cobro }) {}
}

export type CobroActions =
  | SetCobrosSearchTerm
  | LoadCobros
  | LoadCobrosFail
  | LoadCobrosSuccess
  | UpsertCobro
  | RegistrarAplicaciones
  | RegistrarAplicacionesFail
  | RegistrarAplicacionesSuccess
  | EliminarAplicacion
  | EliminarAplicacionFail
  | EliminarAplicacionSuccess;
