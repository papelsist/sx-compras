import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { EnvioComision, EnviosFilter } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

export enum EnvioComisionActionTypes {
  SetEnviosComisionFilter = '[EnvioComisiones Component ] Set EnviosComision filter',
  SetEnvioComisionSearchTerm = '[EnvioComisiones Component] Set EnvioComision search term',
  LoadEnvioComisiones = '[EnvioComisiones Guard] Load EnvioComisiones',
  LoadEnvioComisionesFail = '[EnvioComision API] Load EnvioComisiones fail',
  LoadEnvioComisionesSuccess = '[EnvioComision API] Load EnvioComisiones Success',

  GenerarComisiones = '[EnvioComisiones component] Generar EnvioComisiones',
  GenerarComisionesFail = '[EnvioComision API] Generar EnvioComisiones fail',
  GenerarComisionesSuccess = '[EnvioComision API] Generar EnvioComisiones Success'
}

export class SetEnvioComisionesFilter implements Action {
  readonly type = EnvioComisionActionTypes.SetEnviosComisionFilter;
  constructor(public payload: { filter: EnviosFilter }) {}
}

export class SetEnvioComisionesSearchTerm implements Action {
  readonly type = EnvioComisionActionTypes.SetEnvioComisionSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadEnvioComisiones implements Action {
  readonly type = EnvioComisionActionTypes.LoadEnvioComisiones;
}
export class LoadEnvioComisionesFail implements Action {
  readonly type = EnvioComisionActionTypes.LoadEnvioComisionesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadEnvioComisionesSuccess implements Action {
  readonly type = EnvioComisionActionTypes.LoadEnvioComisionesSuccess;

  constructor(public payload: { comisiones: EnvioComision[] }) {}
}

export class GenerarComisiones implements Action {
  readonly type = EnvioComisionActionTypes.GenerarComisiones;
  constructor(public payload: { periodo: Periodo }) {}
}

export class GenerarComisionesFail implements Action {
  readonly type = EnvioComisionActionTypes.GenerarComisionesFail;
  constructor(public payload: { response: any }) {}
}
export class GenerarComisionesSuccess implements Action {
  readonly type = EnvioComisionActionTypes.GenerarComisionesSuccess;

  constructor(public payload: { comisiones: EnvioComision[] }) {}
}

export type EnvioComisionActions =
  | SetEnvioComisionesFilter
  | SetEnvioComisionesSearchTerm
  | LoadEnvioComisiones
  | LoadEnvioComisionesFail
  | LoadEnvioComisionesSuccess
  | GenerarComisiones
  | GenerarComisionesFail
  | GenerarComisionesSuccess;
