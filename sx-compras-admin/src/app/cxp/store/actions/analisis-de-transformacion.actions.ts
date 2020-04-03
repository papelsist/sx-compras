import { Action } from '@ngrx/store';
import { AnalisisDeTransformacion } from 'app/cxp/model';
import { Update } from '@ngrx/entity';
import { Periodo } from 'app/_core/models/periodo';

export enum AnalisisDeTrsActionTypes {
  LoadAnalisisDeTransformaciones = '[Analisis transformaciones component] Load analisis de TRS',
  LoadAnalisisDeTransformacionesFail = '[analisis transformaciones guard ] Load analisis de TRS fail',
  LoadAnalisisDeTransformacionesSuccess = '[Analisis de TRS API] Load analisis de TRS success',

  // Create
  CreateAnalisisDeTransformacion = '[Analisis transformacion] Create analisis de TRS',
  CreateAnalisisDeTransformacionFail = '[Analisis de TRS API] Create analisis de TRS fail',
  CreateAnalisisDeTransformacionSuccess = '[Analisis de TRS  API] Create analisis de TRS',

  // DELETE
  DeleteAnalisisDeTransformacion = '[Analisis transformaciones component] Delete analisis de TRS',
  DeleteAnalisisDeTransformacionFail = '[Analisis de TRS API] Delete analisis de TRS fail',
  DeleteAnalisisDeTransformacionSuccess = '[Analisis de TRS  API] Delete analisis de TRS',

  // UPDATE
  UpdateAnalisisDeTransformacion = '[Analisis transformacion] Update analisis de TRS',
  UpdateAnalisisDeTransformacionFail = '[Analisis de TRS API] Update analisis de TRS fail',
  UpdateAnalisisDeTransformacionSuccess = '[Analisis de TRS  API] Update analisis de TRS success',

  // Consolidar
  ConsolidarCostos = '[Analisis transformacion] Consolidar costos  de TRSs',
  ConsolidarCostosFail = '[Analisis de TRS API] Consolidar costos  de TRSs fail',
  ConsolidarCostosSuccess = '[Analisis de TRS  API] Consolidar costos  de TRSs success'
}

export class LoadAnalisisDeTransformaciones implements Action {
  readonly type = AnalisisDeTrsActionTypes.LoadAnalisisDeTransformaciones;
  constructor(public payload: { periodo: Periodo }) {}
}
export class LoadAnalisisDeTransformacionesFail implements Action {
  readonly type = AnalisisDeTrsActionTypes.LoadAnalisisDeTransformacionesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadAnalisisDeTransformacionesSuccess implements Action {
  readonly type =
    AnalisisDeTrsActionTypes.LoadAnalisisDeTransformacionesSuccess;
  constructor(public payload: { rows: AnalisisDeTransformacion[] }) {}
}

// Create
export class CreateAnalisisDeTransformacion implements Action {
  readonly type = AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacion;
  constructor(
    public payload: { analisis: Partial<AnalisisDeTransformacion> }
  ) {}
}
export class CreateAnalisisDeTransformacionFail implements Action {
  readonly type = AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionFail;
  constructor(public payload: { response: any }) {}
}
export class CreateAnalisisDeTransformacionSuccess implements Action {
  readonly type =
    AnalisisDeTrsActionTypes.CreateAnalisisDeTransformacionSuccess;
  constructor(public payload: { analisis: AnalisisDeTransformacion }) {}
}

// Update
export class UpdateAnalisisDeTransformacion implements Action {
  readonly type = AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacion;
  constructor(
    public payload: {
      analisis: Update<AnalisisDeTransformacion>;
    }
  ) {}
}
export class UpdateAnalisisDeTransformacionFail implements Action {
  readonly type = AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacionFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateAnalisisDeTransformacionSuccess implements Action {
  readonly type =
    AnalisisDeTrsActionTypes.UpdateAnalisisDeTransformacionSuccess;
  constructor(public payload: { analisis: AnalisisDeTransformacion }) {}
}

// Delete
export class DeleteAnalisisDeTransformacion implements Action {
  readonly type = AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacion;
  constructor(public payload: { id: number }) {}
}

export class DeleteAnalisisDeTransformacionFail implements Action {
  readonly type = AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteAnalisisDeTransformacionSuccess implements Action {
  readonly type =
    AnalisisDeTrsActionTypes.DeleteAnalisisDeTransformacionSuccess;
  constructor(public payload: { analisisId: number }) {}
}

// Consolidar
export class ConsolidarCostos implements Action {
  readonly type = AnalisisDeTrsActionTypes.ConsolidarCostos;
  constructor(
    public payload: {
      periodo: Periodo;
    }
  ) {}
}
export class ConsolidarCostosFail implements Action {
  readonly type = AnalisisDeTrsActionTypes.ConsolidarCostosFail;
  constructor(public payload: { response: any }) {}
}
export class ConsolidarCostosSuccess implements Action {
  readonly type = AnalisisDeTrsActionTypes.ConsolidarCostosSuccess;
  constructor(public payload: { response: any }) {}
}

export type AnalisisDeTrsActions =
  | LoadAnalisisDeTransformaciones
  | LoadAnalisisDeTransformacionesFail
  | LoadAnalisisDeTransformacionesSuccess
  | CreateAnalisisDeTransformacion
  | CreateAnalisisDeTransformacionFail
  | CreateAnalisisDeTransformacionSuccess
  | UpdateAnalisisDeTransformacion
  | UpdateAnalisisDeTransformacionFail
  | UpdateAnalisisDeTransformacionSuccess
  | DeleteAnalisisDeTransformacion
  | DeleteAnalisisDeTransformacionFail
  | DeleteAnalisisDeTransformacionSuccess
  | ConsolidarCostos
  | ConsolidarCostosFail
  | ConsolidarCostosSuccess;
