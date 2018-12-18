import { Action } from '@ngrx/store';

import {
  PagoDeNomina,
  PagoDeNominaCommand,
  PagosDeNominaFilter
} from '../../models';
import { Update } from '@ngrx/entity';
import { PeriodoFilter } from 'app/models';

export enum PagoDeNominaActionTypes {
  SetPagoDeNominasFilter = '[PagoDeNomina Component ] Set PagoDeNomina monedas filter',

  LoadPagoDeNominas = '[PagoNominas Guard] Load PagoNominas',
  LoadPagoDeNominasSuccess = '[PagoDeNomina API] Load PagoNominas Success',

  ImportarPagosDeNomina = '[PagoDeNomina Component] Importar PagsoDeNomina',
  ImportarPagosDeNominaSuccess = '[PagoDeNomina API] Importar PagsoDeNomina Success',

  PagarNomina = '[PagoDeNomina Component] Pagar nomina',
  PagarNominaSuccess = '[PagoDeNomina API] Pagar nomina  Success',

  DeletePagoDeNomina = '[PagoDeNomina Component] Delete PagoDeNomina',
  DeletePagoDeNominaSuccess = '[PagoDeNomina API] Delete PagoDeNomina Success',

  UpsertPagoDeNomina = '[PagoDeNomina exists guard] Upsert PagoDeNomina',

  PagoDeNominaError = '[PagoDeNomina API] PagoDeNomina Http Error'
}

// Filters
export class SetPagoDeNominasFilter implements Action {
  readonly type = PagoDeNominaActionTypes.SetPagoDeNominasFilter;
  constructor(public payload: { filter: PagosDeNominaFilter }) {}
}

// Load
export class LoadPagoDeNominas implements Action {
  readonly type = PagoDeNominaActionTypes.LoadPagoDeNominas;
}
export class LoadPagoDeNominasSuccess implements Action {
  readonly type = PagoDeNominaActionTypes.LoadPagoDeNominasSuccess;

  constructor(public payload: { pagos: PagoDeNomina[] }) {}
}

// Importar
export class ImportarPagosDeNomina implements Action {
  readonly type = PagoDeNominaActionTypes.ImportarPagosDeNomina;

  constructor(public payload: { pago: any }) {}
}
export class ImportarPagosDeNominaSuccess implements Action {
  readonly type = PagoDeNominaActionTypes.ImportarPagosDeNominaSuccess;

  constructor(public payload: { pagos: PagoDeNomina[] }) {}
}
// Pagar
export class PagarNomina implements Action {
  readonly type = PagoDeNominaActionTypes.PagarNomina;
  constructor(public payload: { command: PagoDeNominaCommand }) {}
}
export class PagarNominaSuccess implements Action {
  readonly type = PagoDeNominaActionTypes.PagarNominaSuccess;
  constructor(public payload: { pago: PagoDeNomina }) {}
}

// Delete
export class DeletePagoDeNomina implements Action {
  readonly type = PagoDeNominaActionTypes.DeletePagoDeNomina;

  constructor(public payload: { pago: PagoDeNomina }) {}
}
export class DeletePagoDeNominaSuccess implements Action {
  readonly type = PagoDeNominaActionTypes.DeletePagoDeNominaSuccess;

  constructor(public payload: { pago: PagoDeNomina }) {}
}

// Errors
export class PagoDeNominaError implements Action {
  readonly type = PagoDeNominaActionTypes.PagoDeNominaError;
  constructor(public payload: { response: any }) {}
}

export class UpsertPagoDeNomina implements Action {
  readonly type = PagoDeNominaActionTypes.UpsertPagoDeNomina;
  constructor(public payload: { pago: PagoDeNomina }) {}
}

export type PagoDeNominaActions =
  | SetPagoDeNominasFilter
  | LoadPagoDeNominas
  | LoadPagoDeNominasSuccess
  | ImportarPagosDeNomina
  | ImportarPagosDeNominaSuccess
  | PagarNomina
  | PagarNominaSuccess
  | DeletePagoDeNomina
  | DeletePagoDeNominaSuccess
  | PagoDeNominaError
  | UpsertPagoDeNomina;
