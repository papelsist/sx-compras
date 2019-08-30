import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Rembolso, RembolsosFilter } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

export enum RembolsoActionTypes {
  SetRembolsosPeriodo = '[Rembolsos Component] set Rembolsos periodo',
  SetRembolsosFilter = '[Rembolsos Component ] Set Rembolsos filter',
  SetRembolsosSearchTerm = '[Rembolsos Component] Set Rembolsos term',
  LoadRembolsos = '[Rembolsos Guard] Load Rembolsos',
  LoadRembolsosFail = '[Rembolso API] Load Rembolsos fail',
  LoadRembolsosSuccess = '[Rembolso API] Load Rembolsos Success',

  SaveRembolso = '[Rembolso Component] Save Rembolso',
  SaveRembolsoFail = '[Rembolso API] Save Rembolso Fail',
  SaveRembolsoSuccess = '[Rembolso API] Save Rembolso Success',

  UpdateRembolso = '[Rembolso Component] Update Rembolso',
  UpdateRembolsoFail = '[Rembolso API] Update Rembolso Fail',
  UpdateRembolsoSuccess = '[Rembolso API] Update Rembolso Success',

  UpsertRembolso = '[Rembolso exists guard] Upser existing rembolso',

  DeleteRembolso = '[Rembolso Component] Delete Rembolso',
  DeleteRembolsoFail = '[Rembolso API] Delete Rembolso Fail',
  DeleteRembolsoSuccess = '[Rembolso API] Delete Rembolso Success'
}
export class SetRembolsosPeriodo implements Action {
  readonly type = RembolsoActionTypes.SetRembolsosPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class SetRembolsosFilter implements Action {
  readonly type = RembolsoActionTypes.SetRembolsosFilter;
  constructor(public payload: { filter: RembolsosFilter }) {}
}

export class SetRembolsosSearchTerm implements Action {
  readonly type = RembolsoActionTypes.SetRembolsosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadRembolsos implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsos;
}
export class LoadRembolsosFail implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadRembolsosSuccess implements Action {
  readonly type = RembolsoActionTypes.LoadRembolsosSuccess;

  constructor(public payload: { rembolsos: Rembolso[] }) {}
}

export class SaveRembolso implements Action {
  readonly type = RembolsoActionTypes.SaveRembolso;

  constructor(public payload: { rembolso: Rembolso }) {}
}
export class SaveRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.SaveRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class SaveRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.SaveRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}

export class UpdateRembolso implements Action {
  readonly type = RembolsoActionTypes.UpdateRembolso;

  constructor(public payload: { rembolso: Update<Rembolso> }) {}
}
export class UpdateRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.UpdateRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class UpdateRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.UpdateRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}

export class UpsertRembolso implements Action {
  readonly type = RembolsoActionTypes.UpsertRembolso;
  constructor(public payload: { rembolso: Rembolso }) {}
}

export class DeleteRembolso implements Action {
  readonly type = RembolsoActionTypes.DeleteRembolso;

  constructor(public payload: { rembolso: Rembolso }) {}
}
export class DeleteRembolsoFail implements Action {
  readonly type = RembolsoActionTypes.DeleteRembolsoFail;

  constructor(public payload: { response: any }) {}
}
export class DeleteRembolsoSuccess implements Action {
  readonly type = RembolsoActionTypes.DeleteRembolsoSuccess;

  constructor(public payload: { rembolso: Rembolso }) {}
}

export type RembolsoActions =
  | SetRembolsosPeriodo
  | SetRembolsosFilter
  | SetRembolsosSearchTerm
  | LoadRembolsos
  | LoadRembolsosFail
  | LoadRembolsosSuccess
  | SaveRembolso
  | SaveRembolsoFail
  | SaveRembolsoSuccess
  | UpdateRembolso
  | UpdateRembolsoFail
  | UpdateRembolsoSuccess
  | UpsertRembolso
  | DeleteRembolso
  | DeleteRembolsoFail
  | DeleteRembolsoSuccess;
