import { Action } from '@ngrx/store';

import { RecepcionDeCompra } from '../models/';
import { Periodo } from 'app/_core/models/periodo';

export enum RecepcionActionTypes {
  SetPeriodo = '[Recepciones Component] Set Periodo',

  LoadRecepciones = '[Recepciones Component] Load ',
  LoadRecepcionesFail = '[Recepciones API] Load fail',
  LoadRecepcionesSuccess = '[Recepciones API] Load success',

  UpsertRecepcion = '[Recepcion GUARD] Upsert recepcion'
}

export class SetPeriodo implements Action {
  readonly type = RecepcionActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
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

export class UpsertRecepcion implements Action {
  readonly type = RecepcionActionTypes.UpsertRecepcion;
  constructor(public payload: { recepcion: RecepcionDeCompra }) {}
}

export type RecepcionesActions =
  | LoadRecepciones
  | LoadRecepcionesFail
  | LoadRecepcionesSuccess
  | UpsertRecepcion
  | SetPeriodo;
