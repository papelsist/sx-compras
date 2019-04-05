import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Periodo } from 'app/_core/models/periodo';
import { FacturistaPrestamo } from 'app/control-de-embarques/model';

export enum PrestamosActionTypes {
  SetPrestamosFilter = '[Prestamos Component ] Set Prestamos filter',
  SetPrestamosSearchTerm = '[Prestamos Component] Set Prestamos search term',
  LoadPrestamos = '[Prestamos Guard] Load Prestamos',
  LoadPrestamosFail = '[Prestamos API] Load Prestamos fail',
  LoadPrestamosSuccess = '[Prestamos API] Load Prestamos Success',
  // Create
  CreatePrestamo = '[Prestamos PrestamosComponent] Create prestamos',
  CreatePrestamoFail = '[Prestamos Effect API] Create prestamos fail',
  CreatePrestamoSuccess = '[Prestamos Effect API] Create prestamos success',
  // Update
  UpdatePrestamo = '[Prestamos PrestamosComponent] Update prestamos',
  UpdatePrestamoFail = '[Prestamos Effect API] Update prestamos fail',
  UpdatePrestamoSuccess = '[Prestamos Effect API] Update prestamos success',
  // Delete
  DeletePrestamo = '[Prestamos PrestamosComponent] Delete prestamos',
  DeletePrestamoFail = '[Prestamos Effect API] Delete prestamos fail',
  DeletePrestamoSuccess = '[Prestamos Effect API] Delete prestamos success'
}

export class SetPrestamosFilter implements Action {
  readonly type = PrestamosActionTypes.SetPrestamosFilter;
  constructor(public payload: { filter: { periodo: Periodo } }) {}
}
export class SetPrestamosSearchTerm implements Action {
  readonly type = PrestamosActionTypes.SetPrestamosSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadPrestamos implements Action {
  readonly type = PrestamosActionTypes.LoadPrestamos;
  constructor(public payload: { filter: { periodo: Periodo } }) {}
}
export class LoadPrestamosFail implements Action {
  readonly type = PrestamosActionTypes.LoadPrestamosFail;
  constructor(public payload: { response: any }) {}
}
export class LoadPrestamosSuccess implements Action {
  readonly type = PrestamosActionTypes.LoadPrestamosSuccess;

  constructor(public payload: { prestamos: FacturistaPrestamo[] }) {}
}

// Create
export class CreatePrestamo implements Action {
  readonly type = PrestamosActionTypes.CreatePrestamo;
  constructor(public payload: { prestamo: FacturistaPrestamo }) {}
}
export class CreatePrestamoFail implements Action {
  readonly type = PrestamosActionTypes.CreatePrestamoFail;
  constructor(public payload: { response: any }) {}
}
export class CreatePrestamoSuccess implements Action {
  readonly type = PrestamosActionTypes.CreatePrestamoSuccess;
  constructor(public payload: { prestamo: FacturistaPrestamo }) {}
}

// Update
export class UpdatePrestamo implements Action {
  readonly type = PrestamosActionTypes.UpdatePrestamo;
  constructor(public payload: { update: Update<FacturistaPrestamo> }) {}
}
export class UpdatePrestamoFail implements Action {
  readonly type = PrestamosActionTypes.UpdatePrestamoFail;
  constructor(public payload: { response: any }) {}
}
export class UpdatePrestamoSuccess implements Action {
  readonly type = PrestamosActionTypes.UpdatePrestamoSuccess;
  constructor(public payload: { prestamo: FacturistaPrestamo }) {}
}

// Delete
export class DeletePrestamo implements Action {
  readonly type = PrestamosActionTypes.DeletePrestamo;
  constructor(public payload: { prestamo: FacturistaPrestamo }) {}
}
export class DeletePrestamoFail implements Action {
  readonly type = PrestamosActionTypes.DeletePrestamoFail;
  constructor(public payload: { response: any }) {}
}
export class DeletePrestamoSuccess implements Action {
  readonly type = PrestamosActionTypes.DeletePrestamoSuccess;
  constructor(public payload: { prestamo: FacturistaPrestamo }) {}
}

export type PrestamosActions =
  | SetPrestamosFilter
  | SetPrestamosSearchTerm
  | LoadPrestamos
  | LoadPrestamosFail
  | LoadPrestamosSuccess
  | CreatePrestamo
  | CreatePrestamoFail
  | CreatePrestamoSuccess
  | UpdatePrestamo
  | UpdatePrestamoFail
  | UpdatePrestamoSuccess
  | DeletePrestamo
  | DeletePrestamoFail
  | DeletePrestamoSuccess;
