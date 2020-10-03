import { Action } from '@ngrx/store';

import { GrupoDeProducto } from '../../models/grupo';

export const LOAD_GRUPOS = '[Catalogos] Load grupos';
export const LOAD_GRUPOS_FAIL = '[Catalogos] Load grupos fail';
export const LOAD_GRUPOS_SUCCESS = '[Catalogos] Load grupos success';

export class LoadGrupos implements Action {
  readonly type = LOAD_GRUPOS;
}

export class LoadGruposFail implements Action {
  readonly type = LOAD_GRUPOS_FAIL;
  constructor(public payload: any) {}
}

export class LoadGruposSuccess implements Action {
  readonly type = LOAD_GRUPOS_SUCCESS;
  constructor(public payload: GrupoDeProducto[]) {}
}

// Create actions
export const CREATE_GRUPO = '[Catalogos] Create Grupo';
export const CREATE_GRUPO_FAIL = '[Catalogos] Create Grupo Fail';
export const CREATE_GRUPO_SUCCESS = '[Catalogos] Create Grupo Success';

export class CreateGrupo implements Action {
  readonly type = CREATE_GRUPO;
  constructor(public payload: Partial<GrupoDeProducto>) {}
}
export class CreateGrupoFail implements Action {
  readonly type = CREATE_GRUPO_FAIL;
  constructor(public payload: any) {}
}
export class CreateGrupoSuccess implements Action {
  readonly type = CREATE_GRUPO_SUCCESS;
  constructor(public payload: GrupoDeProducto) {}
}

// Update actions
export const UPDATE_GRUPO = '[Catalogos] Update Grupo';
export const UPDATE_GRUPO_FAIL = '[Catalogos] Update Grupo Fail';
export const UPDATE_GRUPO_SUCCESS = '[Catalogos] Update Grupo Success';

export class UpdateGrupo implements Action {
  readonly type = UPDATE_GRUPO;
  constructor(public payload: GrupoDeProducto) {}
}

export class UpdateGrupoFail implements Action {
  readonly type = UPDATE_GRUPO_FAIL;
  constructor(public payload: any) {}
}

export class UpdateGrupoSuccess implements Action {
  readonly type = UPDATE_GRUPO_SUCCESS;
  constructor(public payload: GrupoDeProducto) {}
}

// Remove actions
export const REMOVE_GRUPO = '[Catalogos] Remove grupo';
export const REMOVE_GRUPO_FAIL = '[Catalogos] Remove grupo Fail';
export const REMOVE_GRUPO_SUCCESS = '[Catalogos] Remove grupo Success';

export class RemoveGrupo implements Action {
  readonly type = REMOVE_GRUPO;
  constructor(public payload: GrupoDeProducto) {}
}

export class RemoveGrupoFail implements Action {
  readonly type = REMOVE_GRUPO_FAIL;
  constructor(public payload: any) {}
}

export class RemoveGrupoSuccess implements Action {
  readonly type = REMOVE_GRUPO_SUCCESS;
  constructor(public payload: GrupoDeProducto) {}
}

export type GrupoActions =
  | LoadGrupos
  | LoadGruposFail
  | LoadGruposSuccess
  | CreateGrupo
  | CreateGrupoFail
  | CreateGrupoSuccess
  | UpdateGrupo
  | UpdateGrupoFail
  | UpdateGrupoSuccess
  | RemoveGrupo
  | RemoveGrupoFail
  | RemoveGrupoSuccess;
