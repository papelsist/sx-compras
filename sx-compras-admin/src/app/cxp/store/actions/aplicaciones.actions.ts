import { Action } from '@ngrx/store';

import { AplicacionDePago, NotaDeCreditoCxP, Pago } from '../../model';

export enum AplicacionesActionTypes {
  AddAplicacion = '[Aplicacion CXP] Add Aplicacion',
  AddAplicacionFail = '[Aplicacion CXP] Add Aplicacion Fail',
  AddAplicacionSuccess = '[Aplicacion CXP] Add Aplicacion Success',
  DeleteAplicacionDePago = '[AplicacionDePago CXP] Delete AplicacionDePago',
  DeleteAplicacionDePagoFail = '[AplicacionDePago CXP] Delete AplicacionDePago Fail',
  DeleteAplicacionDePagoSuccess = '[AplicacionDePago CXP] Delete AplicacionDePago Success',
  DeleteAplicacionDeNota = '[AplicacionDeNota CXP] Delete AplicacionDeNota',
  DeleteAplicacionDeNotaFail = '[AplicacionDeNota CXP] Delete AplicacionDeNota Fail',
  DeleteAplicacionDeNotaSuccess = '[AplicacionDeNota CXP] Delete AplicacionDeNota Success'
}

export class DeleteAplicacionDePago implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDePago;

  constructor(public payload: AplicacionDePago) {}
}
export class DeleteAplicacionDePagoFail implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDePagoFail;

  constructor(public payload: any) {}
}
export class DeleteAplicacionDePagoSuccess implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDePagoSuccess;

  constructor(public payload: Pago) {}
}

export class AddAplicacion implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacion;

  constructor(public payload: AplicacionDePago) {}
}
export class AddAplicacionFail implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacionFail;

  constructor(public payload: any) {}
}
export class AddAplicacionSuccess implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacionSuccess;

  constructor(public payload: NotaDeCreditoCxP | Pago) {}
}

export class DeleteAplicacionDeNota implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDeNota;

  constructor(public payload: AplicacionDePago) {}
}
export class DeleteAplicacionDeNotaFail implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDeNotaFail;

  constructor(public payload: any) {}
}
export class DeleteAplicacionDeNotaSuccess implements Action {
  readonly type = AplicacionesActionTypes.DeleteAplicacionDeNotaSuccess;

  constructor(public payload: NotaDeCreditoCxP) {}
}

export type AplicacionDePagoActions =
  | AddAplicacion
  | AddAplicacionFail
  | AddAplicacionSuccess
  | DeleteAplicacionDePago
  | DeleteAplicacionDePagoFail
  | DeleteAplicacionDePagoSuccess;
