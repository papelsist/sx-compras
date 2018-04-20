import { MovimientoDeCuenta } from './movimientoDeCuenta';
import { CuentaDeBanco } from './cuentaDeBanco';

export interface MovimientoDeTesoreria {
  id?: string;
  folio?: number;
  fecha: string;
  concepto: ConceptoTesoreria;
  importe: number;
  cuenta: CuentaDeBanco;
  movimiento?: MovimientoDeCuenta;
  comentario?: string;
  creado?: string;
  modificado?: string;
}

export type ConceptoTesoreria =
  | 'ACLARACION'
  | 'CONCILIACION'
  | 'FALTANTE'
  | 'SOBRANTE';

export const CONCEPTOS = ['ACLARACION', 'CONCILIACION', 'FALTANTE', 'SOBRANTE'];
