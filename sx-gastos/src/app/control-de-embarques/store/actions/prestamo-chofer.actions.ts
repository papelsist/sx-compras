import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { PrestamoChofer } from 'app/control-de-embarques/model';
import { Periodo } from 'app/_core/models/periodo';

export enum PrestamoChoferActionTypes {
  SetPrestamoChoferFilter = '[PrestamosChofer Component ] Set PrestamoChofer filter',
  SetPrestamoChoferSearchTerm = '[PrestamosChofer Component] Set PrestamoChofer search term',
  LoadPrestamosChofer = '[PrestamosChofer Guard] Load PrestamosChofer',
  LoadPrestamosChoferFail = '[PrestamoChofer API] Load PrestamosChofer fail',
  LoadPrestamosChoferSuccess = '[PrestamoChofer API] Load PrestamosChofer Success'
}

export class SetPrestamoChoferFilter implements Action {
  readonly type = PrestamoChoferActionTypes.SetPrestamoChoferFilter;
  constructor(
    public payload: { filter: { periodo: Periodo; registros: number } }
  ) {}
}
export class SetPrestamoChoferSearchTerm implements Action {
  readonly type = PrestamoChoferActionTypes.SetPrestamoChoferSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadPrestamosChofer implements Action {
  readonly type = PrestamoChoferActionTypes.LoadPrestamosChofer;
}
export class LoadPrestamosChoferFail implements Action {
  readonly type = PrestamoChoferActionTypes.LoadPrestamosChoferFail;
  constructor(public payload: { response: any }) {}
}
export class LoadPrestamosChoferSuccess implements Action {
  readonly type = PrestamoChoferActionTypes.LoadPrestamosChoferSuccess;

  constructor(public payload: { prestamos: PrestamoChofer[] }) {}
}

export type PrestamoChoferActions =
  | SetPrestamoChoferFilter
  | SetPrestamoChoferSearchTerm
  | LoadPrestamosChofer
  | LoadPrestamosChoferFail
  | LoadPrestamosChoferSuccess;
