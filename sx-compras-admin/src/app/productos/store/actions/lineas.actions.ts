import { Action } from '@ngrx/store';

import { Linea } from '../../models/linea';

export const LOAD_LINEAS = '[Catalogos] Load Lineas';
export const LOAD_LINEAS_FAIL = '[Catalogos] Load Lineas fail';
export const LOAD_LINEAS_SUCCESS = '[Catalogos] Load Lineas success';

export class LoadLineas implements Action {
  readonly type = LOAD_LINEAS;
}

export class LoadLineasFail implements Action {
  readonly type = LOAD_LINEAS_FAIL;
  constructor(public payload: any) {}
}

export class LoadLineaSuccess implements Action {
  readonly type = LOAD_LINEAS_SUCCESS;
  constructor(public payload: Linea[]) {}
}

export type LineasActions = LoadLineas | LoadLineasFail | LoadLineaSuccess;
