import { CuentaPorPagar } from './cuentaPorPagar';

export interface NotaDeCreditoCxPDet {
  id: string;
  uuid: string;
  cxp?: Partial<CuentaPorPagar>;
  folio?: string;
  serie?: string;
  fechaDocumento?: string;
  totalDocumento?: number;
  saldoDocumento?: number;
  importe?: number;
  comentario?: string;
  analizado?: number;
  pagado?: number;
  alicable: number;
}
