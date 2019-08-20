import { Action } from '@ngrx/store';
import { Periodo } from 'app/_core/models/periodo';
import { ListaDePreciosVenta } from '../models';
import { Update } from '@ngrx/entity';

export enum ListaActionTypes {
  SetPeriodo = '[Lista de precios component] Set Periodo',
  LoadListaDePrecios = '[Lista de precios component] Load lista',
  LoadListaDePreciosFail = '[Lista de precios API] Load lista fail',
  LoadListaDePreciosSuccess = '[Lista de precios API] Load lista Success',
  // Create
  CreateLista = '[Lista de precios component] Create lista',
  CreateListaFail = '[Lista de precios API] Create lista fail',
  CreateListaSuccess = '[Lista de precios API] Create lista Success',
  // Update
  UpdateLista = '[Lista de precios component] Update lista',
  UpdateListaFail = '[Lista de precios API] Update lista fail',
  UpdateListaSuccess = '[Lista de precios API] Update lista Success',
  UpsertLista = '[Lista de precios exist guard] Requisicion upsert',
  // DELETE
  DeleteLista = '[Lista de precios component] Delete lista',
  DeleteListaFail = '[Lista de precios API] Delete lista fail',
  DeleteListaSuccess = '[Lista de precios API] Delete lista Success',

  // Generar Compra
  AplicarListaDePrecios = '[Lista de precios component] Aplicatar lista',
  AplicarListaDePreciosFail = '[Listas de precio API] Aplicatar lista fail',
  AplicarListaDePreciosSuccess = '[Listas de precio API] Aplicatar lista Success',

  //
  LoadDisponibles = '[ Disponibles guard] Load disponibles para lista',
  LoadDisponiblesFail = '[ Disponibles guard] Load disponibles para lista fail',
  LoadDisponiblesSuccess = '[ Disponibles guard] Load disponibles para lista succcess'
}

export class SetPeriodo implements Action {
  readonly type = ListaActionTypes.SetPeriodo;
  constructor(public payload: { periodo: Periodo }) {}
}

export class LoadListaDePrecios implements Action {
  readonly type = ListaActionTypes.LoadListaDePrecios;
}
export class LoadListaDePreciosFail implements Action {
  readonly type = ListaActionTypes.LoadListaDePreciosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadListaDePreciosSuccess implements Action {
  readonly type = ListaActionTypes.LoadListaDePreciosSuccess;
  constructor(public payload: { listas: ListaDePreciosVenta[] }) {}
}
// Create
export class CreateLista implements Action {
  readonly type = ListaActionTypes.CreateLista;
  constructor(public payload: { lista: Partial<ListaDePreciosVenta> }) {}
}
export class CreateListaFail implements Action {
  readonly type = ListaActionTypes.CreateListaFail;
  constructor(public payload: { response: any }) {}
}
export class CreateListaSuccess implements Action {
  readonly type = ListaActionTypes.CreateListaSuccess;
  constructor(public payload: { lista: ListaDePreciosVenta }) {}
}
// Update
export class UpdateLista implements Action {
  readonly type = ListaActionTypes.UpdateLista;
  constructor(public payload: { update: Update<ListaDePreciosVenta> }) {}
}
export class UpdateListaFail implements Action {
  readonly type = ListaActionTypes.UpdateListaFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateListaSuccess implements Action {
  readonly type = ListaActionTypes.UpdateListaSuccess;
  constructor(public payload: { lista: ListaDePreciosVenta }) {}
}

export class UpsertLista implements Action {
  readonly type = ListaActionTypes.UpsertLista;
  constructor(public payload: { lista: ListaDePreciosVenta }) {}
}

// Delete
export class DeleteLista implements Action {
  readonly type = ListaActionTypes.DeleteLista;
  constructor(public payload: { lista: Partial<ListaDePreciosVenta> }) {}
}
export class DeleteListaFail implements Action {
  readonly type = ListaActionTypes.DeleteListaFail;
  constructor(public payload: { response: any }) {}
}
export class DeleteListaSuccess implements Action {
  readonly type = ListaActionTypes.DeleteListaSuccess;
  constructor(public payload: { lista: Partial<ListaDePreciosVenta> }) {}
}

// Generar COMPRA
export class AplicarListaDePrecios implements Action {
  readonly type = ListaActionTypes.AplicarListaDePrecios;
  constructor(public payload: { lista: Partial<ListaDePreciosVenta> }) {}
}
export class AplicarListaDePreciosFail implements Action {
  readonly type = ListaActionTypes.AplicarListaDePreciosFail;
  constructor(public payload: { response: any }) {}
}
export class AplicarListaDePreciosSuccess implements Action {
  readonly type = ListaActionTypes.AplicarListaDePreciosSuccess;
  constructor(public payload: { lista: ListaDePreciosVenta }) {}
}

export class LoadDisponibles implements Action {
  readonly type = ListaActionTypes.LoadDisponibles;
}
export class LoadDisponiblesFail implements Action {
  readonly type = ListaActionTypes.LoadDisponiblesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadDisponiblesSuccess implements Action {
  readonly type = ListaActionTypes.LoadDisponiblesSuccess;
  constructor(public payload: { rows: any[] }) {}
}

export type ListaDePreciosActions =
  | SetPeriodo
  | LoadListaDePrecios
  | LoadListaDePreciosFail
  | LoadListaDePreciosSuccess
  | CreateLista
  | CreateListaFail
  | CreateListaSuccess
  | UpdateLista
  | UpdateListaFail
  | UpdateListaSuccess
  | UpsertLista
  | DeleteLista
  | DeleteListaFail
  | DeleteListaSuccess
  | AplicarListaDePrecios
  | AplicarListaDePreciosFail
  | AplicarListaDePreciosSuccess
  | LoadDisponibles
  | LoadDisponiblesFail
  | LoadDisponiblesSuccess;
