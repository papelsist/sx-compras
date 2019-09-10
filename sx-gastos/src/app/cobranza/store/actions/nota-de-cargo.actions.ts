import { Action } from '@ngrx/store';

import { NotaDeCargo } from '../../models';
import { Update } from '@ngrx/entity';
import { Periodo } from 'app/_core/models/periodo';

export enum NotaDeCargoActionTypes {
  SetNotasDeCargoPeriodo = '[Notas de cargo Component] Set Notas de cargo periodo',
  LoadNotasDeCargo = '[Notas de cargo Component] Load NotaDeCargos',
  LoadNotasDeCargoSuccess = '[NotaDeCargo Effect] Load NotaDeCargos Success',
  LoadNotasDeCargoFail = '[NotaDeCargo Effect] Load NotaDeCargos Fail',

  // Create
  CreateNotaDeCargo = '[NotaDeCargo component] Create NotaDeCargo',
  CreateNotaDeCargoFail = '[NotaDeCargo effect] Create NotaDeCargo Fail',
  CreateNotaDeCargoSuccess = '[NotaDeCargo effect] Create NotaDeCargo Success',

  // Update
  UpdateNotaDeCargo = '[NotaDeCargo component] Update NotaDeCargo',
  UpdateNotaDeCargoFail = '[NotaDeCargo effect] Update NotaDeCargo fail',
  UpdateNotaDeCargoSuccess = '[NotaDeCargo effect] Update NotaDeCargo success',

  // Delete
  DeleteNotaDeCargo = '[NotaDeCargo component] Delete NotaDeCargo',
  DeleteNotaDeCargoFail = '[NotaDeCargo effect] Delete NotaDeCargo fail',
  DeleteNotaDeCargoSuccess = '[NotaDeCargo effect] Delete NotaDeCargo success',

  UpsertNotaDeCargo = '[NotaDeCargo component] Upsert NotaDeCargo',

  SetNotasDeCargoSearchTerm = '[NotasDeCargo Component] Set NotasDeCargo search term',
  GenerarNotasPorIntereses = 'NotasDeCargo Component] Generar notas por intereses',
  GenerarNotasPorInteresesFail = 'NotasDeCargo Component] Generar notas por intereses fail',
  GenerarNotasPorInteresesSuccess = 'NotasDeCargo Component] Generar notas por intereses success'
}

export class SetNotasDeCargoPeriod implements Action {
  readonly type = NotaDeCargoActionTypes.SetNotasDeCargoPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadNotasDeCargo implements Action {
  readonly type = NotaDeCargoActionTypes.LoadNotasDeCargo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadNotasDeCargoSuccess implements Action {
  readonly type = NotaDeCargoActionTypes.LoadNotasDeCargoSuccess;
  constructor(public payload: { notas: NotaDeCargo[] }) {}
}

export class LoadNotasDeCargoFail implements Action {
  readonly type = NotaDeCargoActionTypes.LoadNotasDeCargoFail;
  constructor(public payload: { response: any }) {}
}

// Create
export class CreateNotaDeCargo implements Action {
  readonly type = NotaDeCargoActionTypes.CreateNotaDeCargo;
  constructor(public payload: { nota: Partial<NotaDeCargo> }) {}
}
export class CreateNotaDeCargoFail implements Action {
  readonly type = NotaDeCargoActionTypes.CreateNotaDeCargoFail;
  constructor(public payload: { response: any }) {}
}
export class CreateNotaDeCargoSuccess implements Action {
  readonly type = NotaDeCargoActionTypes.CreateNotaDeCargoSuccess;
  constructor(public payload: { nota: NotaDeCargo }) {}
}

// Update
export class UpdateNotaDeCargo implements Action {
  readonly type = NotaDeCargoActionTypes.UpdateNotaDeCargo;
  constructor(public payload: { update: Update<NotaDeCargo> }) {}
}
export class UpdateNotaDeCargoFail implements Action {
  readonly type = NotaDeCargoActionTypes.UpdateNotaDeCargoFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateNotaDeCargoSuccess implements Action {
  readonly type = NotaDeCargoActionTypes.UpdateNotaDeCargoSuccess;
  constructor(public payload: { nota: NotaDeCargo }) {}
}

// Delete
export class DeleteNotaDeCargo implements Action {
  readonly type = NotaDeCargoActionTypes.DeleteNotaDeCargo;
  constructor(public payload: { nota: NotaDeCargo }) {}
}
export class DeleteNotaDeCargoFail implements Action {
  readonly type = NotaDeCargoActionTypes.DeleteNotaDeCargoFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteNotaDeCargoSuccess implements Action {
  readonly type = NotaDeCargoActionTypes.DeleteNotaDeCargoSuccess;
  constructor(public payload: { nota: NotaDeCargo }) {}
}

export class SetNotasDeCargoSearchTerm implements Action {
  readonly type = NotaDeCargoActionTypes.SetNotasDeCargoSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class UpsertNotaDeCargo implements Action {
  readonly type = NotaDeCargoActionTypes.UpsertNotaDeCargo;
  constructor(public payload: { nota: NotaDeCargo }) {}
}

export class GenerarNotasPorIntereses implements Action {
  readonly type = NotaDeCargoActionTypes.GenerarNotasPorIntereses;
  constructor(
    public payload: {
      fechaInicial: string;
      fechaFinal: string;
      descripcion: string;
      facturista?: any;
    }
  ) {}
}
export class GenerarNotasPorInteresesFail implements Action {
  readonly type = NotaDeCargoActionTypes.GenerarNotasPorInteresesFail;
  constructor(public payload: { response: any }) {}
}
export class GenerarNotasPorInteresesSuccess implements Action {
  readonly type = NotaDeCargoActionTypes.GenerarNotasPorInteresesSuccess;
  constructor(public payload: { notas: NotaDeCargo[] }) {}
}

export type NotaDeCargoActions =
  | SetNotasDeCargoPeriod
  | LoadNotasDeCargo
  | LoadNotasDeCargoFail
  | LoadNotasDeCargoSuccess
  | CreateNotaDeCargo
  | CreateNotaDeCargoFail
  | CreateNotaDeCargoSuccess
  | UpdateNotaDeCargo
  | UpdateNotaDeCargoFail
  | UpdateNotaDeCargoSuccess
  | DeleteNotaDeCargo
  | DeleteNotaDeCargoFail
  | DeleteNotaDeCargoSuccess
  | SetNotasDeCargoSearchTerm
  | UpsertNotaDeCargo
  | GenerarNotasPorIntereses
  | GenerarNotasPorInteresesFail
  | GenerarNotasPorInteresesSuccess;
