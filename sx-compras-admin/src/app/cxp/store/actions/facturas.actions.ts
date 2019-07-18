import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CuentaPorPagar } from '../../model';
import { Periodo } from 'app/_core/models/periodo';

export enum FacturaActionTypes {
  LoadFacturas = '[Facturas CXP] Load Facturas ',
  LoadFacturasFail = '[Facturas CXP] Load Facturas  fail',
  LoadFacturasSuccess = '[Facturas CXP] Load Facturas  Success',
  UpsertFactura = '[Facturas CXP] Upsert Factura',
  UpdateFactura = '[Facturas CXP] Update Factura',
  UpdateFacturaFail = '[Facturas CXP] Update Factura Fail',
  UpdateFacturaSuccess = '[Facturas CXP] Update Factura Success',
  ClearFacturas = '[Facturas CXP] Clear Facturas',
  SetFacturasPeriodo = '[Facturas CXP] Set Periodo de facturas',
  LoadFactura = '[Facturas CXP] LoadFactura One Factura',
  LoadFacturaFail = '[Facturas CXP] LoadFactura One Factura fail',
  LoadFacturaSuccess = '[Facturas CXP] LoadFactura One Factura Success',
  SaldarCuentaPorPagar = '[Facturas CXP] Saldar cuenta por pagar',
  BuscarPendientesPorProveedor = '[Facturas CXP] Buscar cuentas por pagar por proveedor',
  BuscarPendientesPorProveedorSuccess = '[Facturas CXP] Buscar cuentas por pagar por proveedor success',
  BuscarPendientesPorProveedorFail = '[Facturas CXP] Buscar cuentas por pagar por proveedor fail'
}

export class LoadFacturas implements Action {
  readonly type = FacturaActionTypes.LoadFacturas;
}
export class LoadFacturasFail implements Action {
  readonly type = FacturaActionTypes.LoadFacturasFail;
  constructor(public payload: any) {}
}
export class LoadFacturasSuccess implements Action {
  readonly type = FacturaActionTypes.LoadFacturasSuccess;

  constructor(public payload: CuentaPorPagar[]) {}
}

export class UpdateFactura implements Action {
  readonly type = FacturaActionTypes.UpdateFactura;

  constructor(public payload: CuentaPorPagar) {}
}
export class UpdateFacturaFail implements Action {
  readonly type = FacturaActionTypes.UpdateFacturaFail;

  constructor(public payload: any) {}
}
export class UpdateFacturaSuccess implements Action {
  readonly type = FacturaActionTypes.UpdateFacturaSuccess;

  constructor(public payload: CuentaPorPagar) {}
}

export class UpsertFactura implements Action {
  readonly type = FacturaActionTypes.UpsertFactura;

  constructor(public payload: { factura: CuentaPorPagar }) {}
}

export class ClearFacturas implements Action {
  readonly type = FacturaActionTypes.ClearFacturas;
}

export class SetFacturasPeriodo implements Action {
  readonly type = FacturaActionTypes.SetFacturasPeriodo;
  constructor(public payload: Periodo) {}
}

export class SaldarCuentaPorPagar implements Action {
  readonly type = FacturaActionTypes.SaldarCuentaPorPagar;

  constructor(public payload: Partial<CuentaPorPagar>) {}
}

export class BuscarPendientesPorProveedor implements Action {
  readonly type = FacturaActionTypes.BuscarPendientesPorProveedor;
  constructor(public payload: { proveedorId: string }) {}
}
export class BuscarPendientesPorProveedorFail implements Action {
  readonly type = FacturaActionTypes.BuscarPendientesPorProveedorFail;
  constructor(public payload: any) {}
}
export class BuscarPendientesPorProveedorSuccess implements Action {
  readonly type = FacturaActionTypes.BuscarPendientesPorProveedorSuccess;
  constructor(public payload: CuentaPorPagar[]) {}
}

export type FacturaActions =
  | LoadFacturas
  | LoadFacturasFail
  | LoadFacturasSuccess
  | UpdateFactura
  | UpdateFacturaFail
  | UpdateFacturaSuccess
  | UpsertFactura
  | ClearFacturas
  | SaldarCuentaPorPagar
  | SetFacturasPeriodo
  | BuscarPendientesPorProveedor
  | BuscarPendientesPorProveedorFail
  | BuscarPendientesPorProveedorSuccess;
