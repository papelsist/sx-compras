import { BancoSat } from './bancoSat';
import { Moneda } from './moneda';

export interface CuentaDeBanco {
  id?: string;
  bancoSat: BancoSat;
  numero: string;
  clave: string;
  descripcion: string;
  tipo: TipoDeCuenta;
  moneda: Moneda;
  activo: boolean;
  disponibleEnVenta: boolean;
  subCuentaOperativa?: string;
  impresionTemplate?: string;
  creado?: string;
  modificado?: string;
}

export enum TipoDeCuenta {
  CHEQUE,
  INVERSION
}
