import { CuentaPorCobrar } from './cuentaPorCobrar';
import { Cobro } from './cobro';

export interface AplicacionDeCobro {
  id?: string;
  cuentaPorCobrar: Partial<CuentaPorCobrar>;
  cobro: Partial<Cobro>;
  importe: number;
  fecha: string;
  formaDePago: string;
  recibo: string;
  sucursal?: string;
  fechaDocumento?: string;
  folioDocumento?: string;
  serieDocumento?: string;
  totalDocumento?: number;
  pagoslDocumento?: number;
  saldoDocumento?: number;
  uuidDocumento?: string;
}
