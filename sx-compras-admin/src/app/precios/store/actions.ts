import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { ListaDePreciosVenta } from '../models';
import { Update } from '@ngrx/entity';

export enum ListaDePreciosActionTypes {
  SetPeriodo = '[Lista de precios component] Set Periodo',
  LoadListaDePrecios = '[Lista de precios component] Load Cambios de precio',
  LoadListaDePreciosFail = '[Cambios de precio API] Load Cambios de precio fail',
  LoadListaDePreciosSuccess = '[Cambios de precio API] Load Cambios de precio Success',
  // Create
  CreateCambioDePrecio = '[Lista de precios component] Create Cambio de precio',
  CreateCambioDePrecioFail = '[Cambios de precio API] Create Cambio de precio fail',
  CreateCambioDePrecioSuccess = '[Cambios de precio API] Create Cambio de precio Success',
  // Update
  UpdateCambioDePrecio = '[Lista de precios component] Update Cambio de precio',
  UpdateCambioDePrecioFail = '[Cambios de precio API] Update Cambio de precio fail',
  UpdateCambioDePrecioSuccess = '[Cambios de precio API] Update Cambio de precio Success',
  UpsertCambioDePrecio = '[Cabmio de precio exist guard] Requisicion upsert',
  // DELETE
  DeleteCambioDePrecio = '[Lista de precios component] Delete Cambio de precio',
  DeleteCambioDePrecioFail = '[Cambios de precio API] Delete Cambio de precio fail',
  DeleteCambioDePrecioSuccess = '[Cambios de precio API] Delete Cambio de precio Success',

  // Generar Compra
  AplicarListaDePrecios = '[Lista de precios component] Aplicatar cambio',
  AplicarListaDePreciosFail = '[Cambios de precio API] Aplicatar cambio fail',
  AplicarListaDePreciosSuccess = '[Cambios de precio API] Aplicatar cambio Success'
}

export class SetPeriodo implements Action {
  readonly type = ListaDePreciosActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadListaDePrecios implements Action {
  readonly type = ListaDePreciosActionTypes.LoadListaDePrecios;
}
export class LoadListaDePreciosFail implements Action {
  readonly type = ListaDePreciosActionTypes.LoadListaDePreciosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadListaDePreciosSuccess implements Action {
  readonly type = ListaDePreciosActionTypes.LoadListaDePreciosSuccess;
  constructor(public payload: { cambios: CambioDePrecio[] }) {}
}
// Create
export class CreateCambioDePrecio implements Action {
  readonly type = ListaDePreciosActionTypes.CreateCambioDePrecio;
  constructor(public payload: { cambio: Partial<CambioDePrecio> }) {}
}
export class CreateCambioDePrecioFail implements Action {
  readonly type = ListaDePreciosActionTypes.CreateCambioDePrecioFail;
  constructor(public payload: { response: any }) {}
}
export class CreateCambioDePrecioSuccess implements Action {
  readonly type = ListaDePreciosActionTypes.CreateCambioDePrecioSuccess;
  constructor(public payload: { cambio: CambioDePrecio }) {}
}
// Update
export class UpdateCambioDePrecio implements Action {
  readonly type = ListaDePreciosActionTypes.UpdateCambioDePrecio;
  constructor(public payload: { update: Update<CambioDePrecio> }) {}
}
export class UpdateCambioDePrecioFail implements Action {
  readonly type = ListaDePreciosActionTypes.UpdateCambioDePrecioFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateCambioDePrecioSuccess implements Action {
  readonly type = ListaDePreciosActionTypes.UpdateCambioDePrecioSuccess;
  constructor(public payload: { cambio: CambioDePrecio }) {}
}

export class UpsertCambioDePrecio implements Action {
  readonly type = ListaDePreciosActionTypes.UpsertCambioDePrecio;
  constructor(public payload: { cambio: CambioDePrecio }) {}
}

// Delete
export class DeleteCambioDePrecio implements Action {
  readonly type = ListaDePreciosActionTypes.DeleteCambioDePrecio;
  constructor(public payload: { cambio: Partial<CambioDePrecio> }) {}
}
export class DeleteCambioDePrecioFail implements Action {
  readonly type = ListaDePreciosActionTypes.DeleteCambioDePrecioFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteCambioDePrecioSuccess implements Action {
  readonly type = ListaDePreciosActionTypes.DeleteCambioDePrecioSuccess;
  constructor(public payload: { cambio: Partial<CambioDePrecio> }) {}
}

// Generar COMPRA
export class AplicarListaDePrecios implements Action {
  readonly type = ListaDePreciosActionTypes.AplicarListaDePrecios;
  constructor(public payload: { cambio: Partial<CambioDePrecio> }) {}
}
export class AplicarListaDePreciosFail implements Action {
  readonly type = ListaDePreciosActionTypes.AplicarListaDePreciosFail;
  constructor(public payload: { response: any }) {}
}
export class AplicarListaDePreciosSuccess implements Action {
  readonly type = ListaDePreciosActionTypes.AplicarListaDePreciosSuccess;
  constructor(public payload: { cambio: CambioDePrecio }) {}
}
export type ListaDePreciosActions =
  | SetPeriodo
  | LoadListaDePrecios
  | LoadListaDePreciosFail
  | LoadListaDePreciosSuccess
  | CreateCambioDePrecio
  | CreateCambioDePrecioFail
  | CreateCambioDePrecioSuccess
  | UpdateCambioDePrecio
  | UpdateCambioDePrecioFail
  | UpdateCambioDePrecioSuccess
  | UpsertCambioDePrecio
  | DeleteCambioDePrecio
  | DeleteCambioDePrecioFail
  | DeleteCambioDePrecioSuccess
  | AplicarListaDePrecios
  | AplicarListaDePreciosFail
  | AplicarListaDePreciosSuccess;
