import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

export enum FacturistaActionTypes {
  LoadFacturistas = '[FacturistasDeEmbarque Guard] Load facturistas',
  LoadFacturistasFail = '[FacturistasDeEmbarque API] Load facturistas fail',
  LoadFacturistasSuccess = '[FacturistasDeEmbarque API] Load facturistas success',

  // Create
  CreateFacturista = '[Facturista component] Create facturista',
  CreateFacturistaFail = '[Facturista component] Create facturista fail',
  CreateFacturistaSuccess = '[Facturista component] Create facturista success',

  // Create
  UpdateFacturista = '[Facturista component] Update facturista',
  UpdateFacturistaFail = '[Facturista component] Update facturista fail',
  UpdateFacturistaSuccess = '[Facturista component] Update facturista success',

  // Delete
  DeleteFacturista = '[Facturista component] Delete facturista',
  DeleteFacturistaFail = '[Facturista component] Delete facturista fail',
  DeleteFacturistaSuccess = '[Facturista component] Delete facturista success'
}

export class LoadFacturistas implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistas;
}
export class LoadFacturistasFail implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadFacturistasSuccess implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistasSuccess;
  constructor(public payload: { facturistas: FacturistaDeEmbarque[] }) {}
}
// Create
export class CreateFacturista implements Action {
  readonly type = FacturistaActionTypes.CreateFacturista;
  constructor(public payload: { facturista: Partial<FacturistaDeEmbarque> }) {}
}
export class CreateFacturistaFail implements Action {
  readonly type = FacturistaActionTypes.CreateFacturistaFail;
  constructor(public payload: { response: any }) {}
}
export class CreateFacturistaSuccess implements Action {
  readonly type = FacturistaActionTypes.CreateFacturistaSuccess;
  constructor(public payload: { facturista: FacturistaDeEmbarque }) {}
}

// Update
export class UpdateFacturista implements Action {
  readonly type = FacturistaActionTypes.UpdateFacturista;
  constructor(public payload: { facturista: Update<FacturistaDeEmbarque> }) {}
}
export class UpdateFacturistaFail implements Action {
  readonly type = FacturistaActionTypes.UpdateFacturistaFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateFacturistaSuccess implements Action {
  readonly type = FacturistaActionTypes.UpdateFacturistaSuccess;
  constructor(public payload: { facturista: FacturistaDeEmbarque }) {}
}

// Delete
export class DeleteFacturista implements Action {
  readonly type = FacturistaActionTypes.DeleteFacturista;
  constructor(public payload: { facturistaId: string }) {}
}
export class DeleteFacturistaFail implements Action {
  readonly type = FacturistaActionTypes.DeleteFacturistaFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteFacturistaSuccess implements Action {
  readonly type = FacturistaActionTypes.DeleteFacturistaSuccess;
  constructor(public payload: { facturistaId: string }) {}
}

export type FacturistaActions =
  | LoadFacturistas
  | LoadFacturistasFail
  | LoadFacturistasSuccess
  | CreateFacturista
  | CreateFacturistaFail
  | CreateFacturistaSuccess
  | UpdateFacturista
  | UpdateFacturistaFail
  | UpdateFacturistaSuccess
  | DeleteFacturista
  | DeleteFacturistaFail
  | DeleteFacturistaSuccess;
