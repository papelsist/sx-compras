import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Rembolso, RembolsosFilter } from '../../models';

export enum RembolsoActionTypes {
  SetRembolsosFilter = '[Rembolsos Component ] Set Rembolsos filter',
  SetRembolsosSearchTerm = '[Rembolsos Component] Set Rembolsos term',

  LoadRembolsos = '[Rembolsos Guard] Load Rembolsos',
  LoadRembolsosFail = '[Rembolso API] Load Rembolsos fail',
  LoadRembolsosSuccess = '[Rembolso API] Load Rembolsos Success',

  UpdateRembolso = '[Rembolso Component] Update Rembolso',
  UpdateRembolsoFail = '[Rembolso API] Update Rembolso Fail',
  UpdateRembolsoSuccess = '[Rembolso API] Update Rembolso Success',

  UpsertRembolso = '[Rembolso exists guard] Upser existing rembolso'
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

export type RembolsoActions =
  | SetRembolsosFilter
  | SetRembolsosSearchTerm
  | LoadRembolsos
  | LoadRembolsosFail
  | LoadRembolsosSuccess
  | UpdateRembolso
  | UpdateRembolsoFail
  | UpdateRembolsoSuccess
  | UpsertRembolso;
