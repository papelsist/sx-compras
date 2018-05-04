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

export type MarcasActions = LoadMarcas | LoadMarcasFail | LoadMarcasSuccess;
