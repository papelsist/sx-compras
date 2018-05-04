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

export type ClasesActions = LoadClases | LoadClasesSuccess | LoadClasesFail;
