import { Action } from '@ngrx/store';

import { AplicacionDePago, NotaDeCreditoCxP, Pago } from '../../model';

export enum AplicacionDePagoActionTypes {
  DeleteAplicacionDePago = '[AplicacionDePagos CXP] Delete AplicacionDePago',
  DeleteAplicacionDePagoFail = '[AplicacionDePagos CXP] Delete AplicacionDePago Fail',
  DeleteAplicacionDePagoSuccess = '[AplicacionDePagos CXP] Delete AplicacionDePago Success'
}

export class DeleteAplicacionDePago implements Action {
  readonly type = AplicacionDePagoActionTypes.DeleteAplicacionDePago;

  constructor(public payload: AplicacionDePago) {}
}
export class DeleteAplicacionDePagoFail implements Action {
  readonly type = AplicacionDePagoActionTypes.DeleteAplicacionDePagoFail;

  constructor(public payload: any) {}
}
export class DeleteAplicacionDePagoSuccess implements Action {
  readonly type = AplicacionDePagoActionTypes.DeleteAplicacionDePagoSuccess;

  constructor(public payload: NotaDeCreditoCxP | Pago) {}
}

export type AplicacionDePagoActions =
  | DeleteAplicacionDePago
  | DeleteAplicacionDePagoFail
  | DeleteAplicacionDePagoSuccess;
