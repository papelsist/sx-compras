import { Action } from '@ngrx/store';

import { RecepcionDeCompra, ComsFilter } from '../models/';

export enum RecepcionActionTypes {
  SetRecepcionesFilter = '[Recepciones Component] Change filter',
  SetRecepcionesSearchTerm = '[Recepciones Component] Set Search Term',

  LoadRecepciones = '[Recepciones Component] Load ',
  LoadRecepcionesFail = '[Recepciones API] Load fail',
  LoadRecepcionesSuccess = '[Recepciones API] Load success',

  UpsertRecepcion = '[Recepcion GUARD] Upsert recepcion'
}

export class LoadRecepciones implements Action {
  readonly type = RecepcionActionTypes.LoadRecepciones;
}
export class LoadRecepcionesFail implements Action {
  readonly type = RecepcionActionTypes.LoadRecepcionesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadRecepcionesSuccess implements Action {
  readonly type = RecepcionActionTypes.LoadRecepcionesSuccess;

  constructor(public payload: { recepciones: RecepcionDeCompra[] }) {}
}

export class SetRecepcionesFilter implements Action {
  readonly type = RecepcionActionTypes.SetRecepcionesFilter;
  constructor(public payload: { filter: ComsFilter }) {}
}
export class SetRecepcionesSearchTerm implements Action {
  readonly type = RecepcionActionTypes.SetRecepcionesSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class UpsertRecepcion implements Action {
  readonly type = RecepcionActionTypes.UpsertRecepcion;
  constructor(public payload: { recepcion: RecepcionDeCompra }) {}
}

export type RecepcionesActions =
  | LoadRecepciones
  | LoadRecepcionesFail
  | LoadRecepcionesSuccess
  | UpsertRecepcion
  | SetRecepcionesFilter
  | SetRecepcionesSearchTerm;
