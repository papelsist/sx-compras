import { CuentaPorPagar } from './cuentaPorPagar';

export interface RembolsoDet {
  id?: number;
  cxp?: CuentaPorPagar;
  nombre: string;
  documentoFolio?: string;
  documentoSerie?: string;
  documentoFecha?: string;
  total?: number;
  apagar?: number;
  comentario?: string;
  uuid?: string;
}

export function buildRembolsoDet(cxp: CuentaPorPagar): RembolsoDet {
  const det: RembolsoDet = {
    cxp: cxp,
    nombre: cxp.nombre,
    documentoFolio: cxp.folio,
    documentoSerie: cxp.serie,
    documentoFecha: cxp.fecha,
    total: cxp.importePorPagar,
    apagar: cxp.importePorPagar,
    uuid: cxp.uuid
  };
  return det;
}
