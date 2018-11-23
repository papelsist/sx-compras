import { Action } from '@ngrx/store';

import { AplicacionDePago, NotaDeCreditoCxP, Pago } from '../../model';

export enum AplicacionesActionTypes {
  AddAplicacionNota = '[Aplicacion CXP] Add Aplicacion nota',
  AddAplicacionNotaFail = '[Aplicacion CXP] Add Aplicacion nota Fail',
  AddAplicacionNotaSuccess = '[Aplicacion CXP] Add Aplicacion nota Success',
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

export class AddAplicacionNota implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacionNota;

  constructor(public payload: AplicacionDePago) {}
}
export class AddAplicacionNotaFail implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacionNotaFail;

  constructor(public payload: any) {}
}
export class AddAplicacionNotaSuccess implements Action {
  readonly type = AplicacionesActionTypes.AddAplicacionNotaSuccess;

  constructor(public payload: NotaDeCreditoCxP) {}
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
  | AddAplicacionNota
  | AddAplicacionNotaFail
  | AddAplicacionNotaSuccess
  | DeleteAplicacionDePago
  | DeleteAplicacionDePagoFail
  | DeleteAplicacionDePagoSuccess;
