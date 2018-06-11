import { Action } from '@ngrx/store';

import { Analisis } from '../../model/analisis';

export enum AnalisisActionTypes {
  LOAD = '[Analisis de factura] Load',
  LOAD_FAIL = '[Analisis de factura] Load Fail',
  LOAD_SUCCESS = '[Analisis de factura] Load Success'
}

export class Load implements Action {
  readonly type = AnalisisActionTypes.LOAD;
  // constructor(public payload: any) {}
}
export class LoadFail implements Action {
  readonly type = AnalisisActionTypes.LOAD_FAIL;
  constructor(public payload: any) {}
}
export class LoadSuccess implements Action {
  readonly type = AnalisisActionTypes.LOAD_SUCCESS;
  constructor(public payload: Analisis[]) {}
}

export type AnalisisActions = Load | LoadFail | LoadSuccess;
