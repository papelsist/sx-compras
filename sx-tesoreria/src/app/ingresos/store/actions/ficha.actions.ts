import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Ficha, FichaBuildCommand } from 'app/ingresos/models';

export enum FichaActionTypes {
  SetFichasFilter = '[Fichas Component ] Set Fichas filter',
  LoadFichas = '[Fichas Guard] Load Fichas',
  LoadFichasSuccess = '[Fichas API] Load Fichas Success',

  GenerateFichas = '[Fichas Component] Generate Fichsa',
  GenerateFichasSuccess = '[Ficha API] Generate Fichsa Success',

  FichaError = '[Ficha API] Fichas http error'
}

export class SetFichasFilter implements Action {
  readonly type = FichaActionTypes.SetFichasFilter;
  constructor(public payload: { filter: any }) {}
}

export class LoadFichas implements Action {
  readonly type = FichaActionTypes.LoadFichas;
}

export class LoadFichasSuccess implements Action {
  readonly type = FichaActionTypes.LoadFichasSuccess;

  constructor(public payload: { fichas: Ficha[] }) {}
}

export class GenerateFichas implements Action {
  readonly type = FichaActionTypes.GenerateFichas;
  constructor(public payload: { command: FichaBuildCommand }) {}
}

export class GenerateFichasSuccess implements Action {
  readonly type = FichaActionTypes.GenerateFichasSuccess;
  constructor(public payload: { fichas: Ficha[] }) {}
}

export class FichaError implements Action {
  readonly type = FichaActionTypes.FichaError;
  constructor(public payload: { response: any }) {}
}

export type FichaActions =
  | SetFichasFilter
  | LoadFichas
  | LoadFichasSuccess
  | GenerateFichas
  | GenerateFichasSuccess
  | FichaError;
