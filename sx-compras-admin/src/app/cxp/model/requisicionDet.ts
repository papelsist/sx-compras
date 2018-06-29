import { CuentaPorPagar } from './cuentaPorPagar';

export interface RequisicionDet {
  id?: string;
  cxp: CuentaPorPagar;
  documentoFolio?: string;
  documentoSerie?: string;
  documentoFecha?: string;
  documentoTotal?: number;
  uuid?: string;
  acuse?: string;
  impuestos?: number;
  total?: number;
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
    analizado: cxp.importePorPagar
  };
  return det;
}
