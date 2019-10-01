import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AnalisisDeTransformacionDet } from 'app/cxp/model';

export enum AnalisisTrsDetActionTypes {
  LoadAnalisisTrsDet = '[Analisis de transformacion Component] Load analisis de transfomaciones det',
  LoadAnalisisTrsDetFail = '[AnalisisTrsDet API] Load analisis de transfomaciones det fail',
  LoadAnalisisTrsDetSuccess = '[AnalisisTrsDet API] Load analisis de transfomaciones det success',

  // Create
  AddAnalisisTrsDet = '[Analisis TRS Component] Add analisis TRS det',
  AddAnalisisTrsDetFail = '[AnalisisTrsDet API] Add analisis TRS det fail',
  AddAnalisisTrsDetSuccess = '[AnalisisTrsDet  API] Add analisis TRS det',

  // DELETE
  RemoveAnalisisTrsDet = '[Analisis TRS Component] Remove Analisis TRS Det',
  RemoveAnalisisTrsDetFail = '[AnalisisTrsDet API] Remove Analisis TRS Det fail',
  RemoveAnalisisTrsDetSuccess = '[AnalisisTrsDet  API] Remove Analisis TRS Det',

  // UPDATE
  UpdateAnalisisTrsDet = '[Analisis TRS Component] Update Analisis TRS Det',
  UpdateAnalisisTrsDetFail = '[AnalisisTrsDet API] Update Analisis TRS Det fail',
  UpdateAnalisisTrsDetSuccess = '[AnalisisTrsDet  API] Update Analisis TRS Det success'
}

export class LoadAnalisisTrsDet implements Action {
  readonly type = AnalisisTrsDetActionTypes.LoadAnalisisTrsDet;
  constructor(public payload: { analisisId: number }) {}
}
export class LoadAnalisisTrsDetFail implements Action {
  readonly type = AnalisisTrsDetActionTypes.LoadAnalisisTrsDetFail;
  constructor(public payload: { response: any }) {}
}
export class LoadAnalisisTrsDetSuccess implements Action {
  readonly type = AnalisisTrsDetActionTypes.LoadAnalisisTrsDetSuccess;
  constructor(public payload: { partidas: AnalisisDeTransformacionDet[] }) {}
}

// Create
export class AddAnalisisTrsDet implements Action {
  readonly type = AnalisisTrsDetActionTypes.AddAnalisisTrsDet;
  constructor(
    public payload: {
      analisisId: number;
      det: Partial<AnalisisDeTransformacionDet>;
    }
  ) {}
}
export class AddAnalisisTrsDetFail implements Action {
  readonly type = AnalisisTrsDetActionTypes.AddAnalisisTrsDetFail;
  constructor(public payload: { response: any }) {}
}
export class AddAnalisisTrsDetSuccess implements Action {
  readonly type = AnalisisTrsDetActionTypes.AddAnalisisTrsDetSuccess;
  constructor(public payload: { det: AnalisisDeTransformacionDet }) {}
}

// Update
export class UpdateAnalisisTrsDet implements Action {
  readonly type = AnalisisTrsDetActionTypes.UpdateAnalisisTrsDet;
  constructor(
    public payload: {
      analisisId: number;
      det: Update<AnalisisDeTransformacionDet>;
    }
  ) {}
}
export class UpdateAnalisisTrsDetFail implements Action {
  readonly type = AnalisisTrsDetActionTypes.UpdateAnalisisTrsDetFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateAnalisisTrsDetSuccess implements Action {
  readonly type = AnalisisTrsDetActionTypes.UpdateAnalisisTrsDetSuccess;
  constructor(public payload: { det: AnalisisDeTransformacionDet }) {}
}

// Delete
export class RemoveAnalisisTrsDet implements Action {
  readonly type = AnalisisTrsDetActionTypes.RemoveAnalisisTrsDet;
  constructor(public payload: { analisisId: number; id: number }) {}
}
export class RemoveAnalisisTrsDetFail implements Action {
  readonly type = AnalisisTrsDetActionTypes.RemoveAnalisisTrsDetFail;
  constructor(public payload: { response: any }) {}
}
export class RemoveAnalisisTrsDetSuccess implements Action {
  readonly type = AnalisisTrsDetActionTypes.RemoveAnalisisTrsDetSuccess;
  constructor(public payload: { id: number }) {}
}

export type AnalisisTrsDetActions =
  | LoadAnalisisTrsDet
  | LoadAnalisisTrsDetFail
  | LoadAnalisisTrsDetSuccess
  | AddAnalisisTrsDet
  | AddAnalisisTrsDetFail
  | AddAnalisisTrsDetSuccess
  | UpdateAnalisisTrsDet
  | UpdateAnalisisTrsDetFail
  | UpdateAnalisisTrsDetSuccess
  | RemoveAnalisisTrsDet
  | RemoveAnalisisTrsDetFail
  | RemoveAnalisisTrsDetSuccess;
