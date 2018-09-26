import { Action } from '@ngrx/store';

export enum ApplicationActionTypes {
  SetGlobalLoading = '[Application] Set global loading'
}

export class SetGlobalLoading implements Action {
  readonly type = ApplicationActionTypes.SetGlobalLoading;
  constructor(public payload: { loading: boolean }) {}
}

export type ApplicationActions = SetGlobalLoading;
