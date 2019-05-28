import { CuentaPorCobrar } from './cuentaPorCobrar';

export interface NotaDeCreditoDet {
  id?: string;
  cuentaPorCobrar?: Partial<CuentaPorCobrar>;
  base: number;
  impuesto: number;
  importe: number;
  documento: number;
  tipoDeDocumento: string;
  fechaDocumento: string;
  totalDocumento: number;
  saldoDocumento: number;
  sucursal: string;
  comentario: string;
}
