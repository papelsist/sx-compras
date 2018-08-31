import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ProveedorProducto } from '../../../proveedores/models/proveedorProducto';

export enum ProductosDisponiblesActionTypes {
  LoadProductosDisponibles = '[Compra] Load ProductosDisponibles',
  LoadProductosDisponiblesFail = '[Compra] Load ProductosDisponibles fail',
  LoadProductosDisponiblesSuccess = '[Compra] Load ProductosDisponibles Success',
  ClearProductosDisponibles = '[Compra] Clear ProductosDisponibles'
}

export class LoadProductosDisponibles implements Action {
  readonly type = ProductosDisponiblesActionTypes.LoadProductosDisponibles;
}
export class LoadProductosDisponiblesFail implements Action {
  readonly type = ProductosDisponiblesActionTypes.LoadProductosDisponiblesFail;
  constructor(public payload: any) {}
}
export class LoadProductosDisponiblesSuccess implements Action {
  readonly type = ProductosDisponiblesActionTypes.LoadProductosDisponiblesSuccess;

  constructor(public payload: ProveedorProducto[]) {}
}
export class ClearProductosDisponibles implements Action {
  readonly type = ProductosDisponiblesActionTypes.ClearProductosDisponibles;
}

export type ProductosDisponiblesActions =
  | LoadProductosDisponibles
  | LoadProductosDisponiblesFail
  | LoadProductosDisponiblesSuccess
  | ClearProductosDisponibles;
