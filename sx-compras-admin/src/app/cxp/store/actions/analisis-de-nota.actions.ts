import { Action } from '@ngrx/store';
import { AnalisisDeNota } from 'app/cxp/model';
import { Update } from '@ngrx/entity';

export enum AnalisisDeNotaActionTypes {
  LoadAnalisisDeNota = '[Analisis de nota component] Load analisis de nota',
  LoadAnalisisDeNotaFail = '[Analisis de nota API] Load analisis de nota fail',
  LoadAnalisisDeNotaSuccess = '[Analisis de nota API] Load analisis de nota success',

  // Create
  CreateAnalisisDeNota = '[AnalisisDeNota Component] Create analisis de nota',
  CreateAnalisisDeNotaFail = '[Analisis de nota API] Create analisis de nota fail',
  CreateAnalisisDeNotaSuccess = '[Analisis de nota  API] Create analisis de nota',

  // DELETE
  DeleteAnalisisDeNota = '[AnalisisDeNota Component] Delete analisis de nota',
  DeleteAnalisisDeNotaFail = '[Analisis de nota API] Delete analisis de nota fail',
  DeleteAnalisisDeNotaSuccess = '[Analisis de nota  API] Delete analisis de nota',

  // UPDATE
  UpdateAnalisisDeNota = '[AnalisisDeNota Component] Update analisis de nota',
  UpdateAnalisisDeNotaFail = '[Analisis de nota API] Update analisis de nota fail',
  UpdateAnalisisDeNotaSuccess = '[Analisis de nota  API] Update analisis de nota success'
}

export class LoadAnalisisDeNota implements Action {
  readonly type = AnalisisDeNotaActionTypes.LoadAnalisisDeNota;
  constructor(public payload: { notaId: string }) {}
}
export class LoadAnalisisDeNotaFail implements Action {
  readonly type = AnalisisDeNotaActionTypes.LoadAnalisisDeNotaFail;
  constructor(public payload: { response: any }) {}
}
export class LoadAnalisisDeNotaSuccess implements Action {
  readonly type = AnalisisDeNotaActionTypes.LoadAnalisisDeNotaSuccess;
  constructor(public payload: { analisis: AnalisisDeNota[] }) {}
}

// Create
export class CreateAnalisisDeNota implements Action {
  readonly type = AnalisisDeNotaActionTypes.CreateAnalisisDeNota;
  constructor(
    public payload: { notaId: string; analisis: Partial<AnalisisDeNota> }
  ) {}
}
export class CreateAnalisisDeNotaFail implements Action {
  readonly type = AnalisisDeNotaActionTypes.CreateAnalisisDeNotaFail;
  constructor(public payload: { response: any }) {}
}
export class CreateAnalisisDeNotaSuccess implements Action {
  readonly type = AnalisisDeNotaActionTypes.CreateAnalisisDeNotaSuccess;
  constructor(public payload: { analisis: AnalisisDeNota }) {}
}

// Update
export class UpdateAnalisisDeNota implements Action {
  readonly type = AnalisisDeNotaActionTypes.UpdateAnalisisDeNota;
  constructor(
    public payload: { notaId: string; analisis: Update<AnalisisDeNota> }
  ) {}
}
export class UpdateAnalisisDeNotaFail implements Action {
  readonly type = AnalisisDeNotaActionTypes.UpdateAnalisisDeNotaFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateAnalisisDeNotaSuccess implements Action {
  readonly type = AnalisisDeNotaActionTypes.UpdateAnalisisDeNotaSuccess;
  constructor(public payload: { analisis: AnalisisDeNota }) {}
}

// Delete
export class DeleteAnalisisDeNota implements Action {
  readonly type = AnalisisDeNotaActionTypes.DeleteAnalisisDeNota;
  constructor(public payload: { notaId: string; analisisId: number }) {}
}
export class DeleteAnalisisDeNotaFail implements Action {
  readonly type = AnalisisDeNotaActionTypes.DeleteAnalisisDeNotaFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteAnalisisDeNotaSuccess implements Action {
  readonly type = AnalisisDeNotaActionTypes.DeleteAnalisisDeNotaSuccess;
  constructor(public payload: { analisisId: number }) {}
}

export type AnalisisDeNotaActions =
  | LoadAnalisisDeNota
  | LoadAnalisisDeNotaFail
  | LoadAnalisisDeNotaSuccess
  | CreateAnalisisDeNota
  | CreateAnalisisDeNotaFail
  | CreateAnalisisDeNotaSuccess
  | UpdateAnalisisDeNota
  | UpdateAnalisisDeNotaFail
  | UpdateAnalisisDeNotaSuccess
  | DeleteAnalisisDeNota
  | DeleteAnalisisDeNotaFail
  | DeleteAnalisisDeNotaSuccess;
