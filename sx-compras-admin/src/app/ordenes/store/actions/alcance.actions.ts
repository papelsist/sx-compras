import { Action } from '@ngrx/store';

export enum AlcanceActionTypes {
  LoadAlcances = '[Alcance] Load Alcances'
}

export class Alcance implements Action {
  readonly type = AlcanceActionTypes.LoadAlcances;
}

export type AlcanceActions = LoadAlcances;
