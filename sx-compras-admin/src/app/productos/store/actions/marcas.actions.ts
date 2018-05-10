import { Action } from '@ngrx/store';

import { Marca } from '../../models/marca';

export const LOAD_MARCAS = '[Catalogos] Load marcas';
export const LOAD_MARCAS_FAIL = '[Catalogos] Load marcas fail';
export const LOAD_MARCAS_SUCCESS = '[Catalogos] Load marcas success';

export class LoadMarcas implements Action {
  readonly type = LOAD_MARCAS;
}

export class LoadMarcasSuccess implements Action {
  readonly type = LOAD_MARCAS_SUCCESS;
  constructor(public payload: Marca[]) {}
}

export class LoadMarcasFail implements Action {
  readonly type = LOAD_MARCAS_FAIL;
  constructor(public payload: any) {}
}

// Create actions
export const CREATE_MARCA = '[Catalogos] Create Marca';
export const CREATE_MARCA_FAIL = '[Catalogos] Create Marca Fail';
export const CREATE_MARCA_SUCCESS = '[Catalogos] Create Marca Success';

export class CreateMarca implements Action {
  readonly type = CREATE_MARCA;
  constructor(public payload: Marca) {}
}

export class CreateMarcaFail implements Action {
  readonly type = CREATE_MARCA_FAIL;
  constructor(public payload: any) {}
}

export class CreateMarcaSuccess implements Action {
  readonly type = CREATE_MARCA_SUCCESS;
  constructor(public payload: Marca) {}
}

// Update actions
export const UPDATE_MARCA = '[Catalogos] Update Marca';
export const UPDATE_MARCA_FAIL = '[Catalogos] Update Marca Fail';
export const UPDATE_MARCA_SUCCESS = '[Catalogos] Update Marca Success';

export class UpdateMarca implements Action {
  readonly type = UPDATE_MARCA;
  constructor(public payload: Marca) {}
}

export class UpdateMarcaFail implements Action {
  readonly type = UPDATE_MARCA_FAIL;
  constructor(public payload: any) {}
}

export class UpdateMarcaSuccess implements Action {
  readonly type = UPDATE_MARCA_SUCCESS;
  constructor(public payload: Marca) {}
}

// Delete actions
export const REMOVE_MARCA = '[Catalogos] Remove Marca';
export const REMOVE_MARCA_FAIL = '[Catalogos] Remove Marca Fail';
export const REMOVE_MARCA_SUCCESS = '[Catalogos] Remove Marca Success';

export class RemoveMarca implements Action {
  readonly type = REMOVE_MARCA;
  constructor(public payload: Marca) {}
}

export class RemoveMarcaFail implements Action {
  readonly type = REMOVE_MARCA_FAIL;
  constructor(public payload: any) {}
}

export class RemoveMarcaSuccess implements Action {
  readonly type = REMOVE_MARCA_SUCCESS;
  constructor(public payload: Marca) {}
}

export type MarcasActions =
  | LoadMarcas
  | LoadMarcasFail
  | LoadMarcasSuccess
  | CreateMarca
  | CreateMarcaFail
  | CreateMarcaSuccess
  | UpdateMarca
  | UpdateMarcaFail
  | UpdateMarcaSuccess
  | RemoveMarca
  | RemoveMarcaFail
  | RemoveMarcaSuccess;
