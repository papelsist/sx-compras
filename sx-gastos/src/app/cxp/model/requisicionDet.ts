import { CuentaPorPagar } from './cuentaPorPagar';

export interface RequisicionDet {
  id?: string;
  cxp: CuentaPorPagar;
  documentoFolio?: string;
  documentoSerie?: string;
  documentoFecha?: string;
  documentoTotal?: number;
  documentoSaldo?: number;
  documentoPagos?: number;
  documentoCompensaciones?: number;
  uuid?: string;
  acuse?: string;
  impuestos?: number;
  total?: number;
  descuentof?: number;
  descuentofImporte?: number;
  apagar?: number;
  analizado?: number;
  comentario?: string;
}

export function fromFactura(cxp: CuentaPorPagar): RequisicionDet {
  const det: RequisicionDet = {
    cxp: cxp,
    documentoFolio: cxp.folio,
    documentoSerie: cxp.serie,
    documentoTotal: cxp.total,
    documentoFecha: cxp.fecha,
    uuid: cxp.uuid,
    total: cxp.importePorPagar,
    apagar: cxp.importePorPagar,
    documentoSaldo: cxp.saldo,
    analizado: cxp.importePorPagar
  };
  return det;
}
