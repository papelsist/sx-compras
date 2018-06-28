import { CuentaPorPagar } from './cuentaPorPagar';

export interface RequisicionDet {
  id: string;
  cuentaPorPagar: Partial<CuentaPorPagar>;
  importe: number;
  descuentoFinanciero: number;
  comentario: string;
}
