import { Action } from '@ngrx/store';

import { Clase } from '../../models/clase';

export const LOAD_CLASES = '[Catalogos] Load clases';
export const LOAD_CLASES_FAIL = '[Catalogos] Load clases fail';
export const LOAD_CLASES_SUCCESS = '[Catalogos] Load clases success';

export class LoadClases implements Action {
  readonly type = LOAD_CLASES;
}

export class LoadClasesSuccess implements Action {
  readonly type = LOAD_CLASES_SUCCESS;
  constructor(public payload: Clase[]) {}
}

export class LoadClasesFail implements Action {
  readonly type = LOAD_CLASES_FAIL;
  constructor(public payload: any) {}
}

// Create actions
export const CREATE_CLASE = '[Catalogos] Create Clase';
export const CREATE_CLASE_FAIL = '[Catalogos] Create Clase Fail';
export const CREATE_CLASE_SUCCESS = '[Catalogos] Create Clase Success';

export class CreateClase implements Action {
  readonly type = CREATE_CLASE;
  constructor(public payload: Clase) {}
}

export class CreateClaseFail implements Action {
  readonly type = CREATE_CLASE_FAIL;
  constructor(public payload: any) {}
}

export class CreateClaseSuccess implements Action {
  readonly type = CREATE_CLASE_SUCCESS;
  constructor(public payload: Clase) {}
}

// Edit actions
export const UPDATE_CLASE = '[Catalogos] Update Clase';
export const UPDATE_CLASE_FAIL = '[Catalogos] Update Clase Fail';
export const UPDATE_CLASE_SUCCESS = '[Catalogos] Update Clase Success';

export class UpdateClase implements Action {
  readonly type = UPDATE_CLASE;
  constructor(public payload: Clase) {}
}

export class UpdateClaseFail implements Action {
  readonly type = UPDATE_CLASE_FAIL;
  constructor(public payload: any) {}
}

export class UpdateClaseSuccess implements Action {
  readonly type = UPDATE_CLASE_SUCCESS;
  constructor(public payload: Clase) {}
}

export type ClasesActions =
  | LoadClases
  | LoadClasesSuccess
  | LoadClasesFail
  | CreateClase
  | CreateClaseFail
  | CreateClaseSuccess
  | UpdateClase
  | UpdateClaseFail
  | UpdateClaseSuccess;
