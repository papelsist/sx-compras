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

export class LoadLineasSuccess implements Action {
  readonly type = LOAD_LINEAS_SUCCESS;
  constructor(public payload: Linea[]) {}
}

// Create actions
export const CREATE_LINEA = '[Catalogos] Create Linea';
export const CREATE_LINEA_FAIL = '[Catalogos] Create Linea Fail';
export const CREATE_LINEA_SUCCESS = '[Catalogos] Create Linea Success';

export class CreateLinea implements Action {
  readonly type = CREATE_LINEA;
  constructor(public payload: Linea) {}
}
export class CreateLineaFail implements Action {
  readonly type = CREATE_LINEA_FAIL;
  constructor(public payload: any) {}
}
export class CreateLineaSuccess implements Action {
  readonly type = CREATE_LINEA_SUCCESS;
  constructor(public payload: Linea) {}
}

// Update actions
export const UPDATE_LINEA = '[Catalogos] Update Linea';
export const UPDATE_LINEA_FAIL = '[Catalogos] Update Linea Fail';
export const UPDATE_LINEA_SUCCESS = '[Catalogos] Update Linea Success';

export class UpdateLinea implements Action {
  readonly type = UPDATE_LINEA;
  constructor(public payload: Linea) {}
}

export class UpdateLineaFail implements Action {
  readonly type = UPDATE_LINEA_FAIL;
  constructor(public payload: any) {}
}

export class UpdateLineaSuccess implements Action {
  readonly type = UPDATE_LINEA_SUCCESS;
  constructor(public payload: Linea) {}
}

// Remove actions
export const REMOVE_LINEA = '[Catalogos] Remove linea';
export const REMOVE_LINEA_FAIL = '[Catalogos] Remove linea Fail';
export const REMOVE_LINEA_SUCCESS = '[Catalogos] Remove linea Success';

export class RemoveLinea implements Action {
  readonly type = REMOVE_LINEA;
  constructor(public payload: Linea) {}
}

export class RemoveLineaFail implements Action {
  readonly type = REMOVE_LINEA_FAIL;
  constructor(public payload: any) {}
}

export class RemoveLineaSuccess implements Action {
  readonly type = REMOVE_LINEA_SUCCESS;
  constructor(public payload: Linea) {}
}

export type LineasActions =
  | LoadLineas
  | LoadLineasFail
  | LoadLineasSuccess
  | CreateLinea
  | CreateLineaFail
  | CreateLineaSuccess
  | UpdateLinea
  | UpdateLineaFail
  | UpdateLineaSuccess
  | RemoveLinea
  | RemoveLineaFail
  | RemoveLineaSuccess;
