import { Action } from '@ngrx/store';

import { CuentaPorPagar } from '../../model';

export enum FormActionTypes {
  LOAD_FACTURAS_POR_REQUISITAR = '[Requisicion de compra] Facturas pendientes por requisitar',
  LOAD_FACTURAS_POR_REQUISITAR_FAIL = '[Requisicion de compra] Facturas pendientes por requisitar fail',
  LOAD_FACTURAS_POR_REQUISITAR_SUCCESS = '[Requisicion de compra] Facturas pendientes por requisitar success'
}

export class LoadFacturasPorRequisitar implements Action {
  readonly type = FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR;
  constructor(public payload: string) {}
}

export class LoadFacturasPorRequisitarFail implements Action {
  readonly type = FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR_FAIL;
  constructor(public payload: any) {}
}
export class LoadFacturasPorRequisitarSuccess implements Action {
  readonly type = FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR_SUCCESS;
  constructor(public payload: CuentaPorPagar[]) {}
}

export type FormActions =
  | LoadFacturasPorRequisitar
  | LoadFacturasPorRequisitarFail
  | LoadFacturasPorRequisitarSuccess;
