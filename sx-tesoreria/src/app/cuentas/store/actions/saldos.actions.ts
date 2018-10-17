import { Action } from '@ngrx/store';

import { SaldoPorCuenta } from '../../models/saldoPorCuenta';
import { CuentaDeBanco } from 'app/models';

export enum SaldoActionTypes {
  LoadSaldos = '[Cuentas component] Load Saldos',
  LoadSaldosFail = '[Saldos API effect] Load Saldos fail',
  LoadSaldosSuccess = '[Saldos API effect] Load Saldos Success'
}

export class LoadSaldos implements Action {
  readonly type = SaldoActionTypes.LoadSaldos;
  constructor(public payload: { cuenta: CuentaDeBanco }) {}
}
export class LoadSaldosFail implements Action {
  readonly type = SaldoActionTypes.LoadSaldosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadSaldosSuccess implements Action {
  readonly type = SaldoActionTypes.LoadSaldosSuccess;

  constructor(public payload: { saldos: SaldoPorCuenta[] }) {}
}

export type SaldoActions = LoadSaldos | LoadSaldosFail | LoadSaldosSuccess;
