import { Action } from '@ngrx/store';

import { Cartera } from '../../models';

export enum CarteraActionTypes {
  SetCartera = '[Cartera Router Guard] Set cartera'
}

export class SetCartera implements Action {
  readonly type = CarteraActionTypes.SetCartera;
  constructor(public payload: {cartera: Cartera}) {}
}

export type CarteraActions = SetCartera;
