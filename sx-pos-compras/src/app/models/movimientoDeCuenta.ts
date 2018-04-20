import { CuentaDeBanco } from './cuentaDeBanco';
import { Moneda } from './moneda';

export interface MovimientoDeCuenta {
  id?: string;
  cuenta: CuentaDeBanco;
  aFabor: string;
  fecha: string;
  formaDePago: string;
  tipo: TipoDeMovimiento;
  referencia: string;
  importe: number;
  concepto: string;
  moneda: Moneda;
  tipoDeCambio: number;
  comentario?: string;
  creado?: string;
  modificado?: string;
}

export enum TipoDeMovimiento {
  CRE,
  CON,
  COD,
  JUR,
  CHE
}
