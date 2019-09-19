import { CuentaPorPagar } from './cuentaPorPagar';
import { NotaDeCreditoCxP } from './notaDeCreditoCxP';

export interface RembolsoDet {
  id?: number;
  cxp?: CuentaPorPagar;
  nota?: Partial<NotaDeCreditoCxP>;
  nombre: string;
  documentoFolio?: string;
  documentoSerie?: string;
  documentoFecha?: string;
  total?: number;
  apagar?: number;
  comentario?: string;
  concepto?: string;
  uuid?: string;
  sucursal?: string;
}

export function buildRembolsoDet(cxp: CuentaPorPagar): RembolsoDet {
  const det: RembolsoDet = {
    cxp: cxp,
    nombre: cxp.nombre,
    documentoFolio: cxp.folio,
    documentoSerie: cxp.serie,
    documentoFecha: cxp.fecha,
    total: cxp.total,
    apagar: cxp.total,
    concepto: 'GASTO',
    uuid: cxp.uuid
  };
  return det;
}

export function buildRembolsoDetFromNota(nota: NotaDeCreditoCxP): RembolsoDet {
  const det: RembolsoDet = {
    nota: nota,
    nombre: nota.nombre,
    documentoFolio: nota.folio,
    documentoSerie: nota.serie,
    documentoFecha: nota.fecha,
    total: nota.total * -1,
    apagar: nota.total * -1,
    concepto: 'GASTO',
    uuid: nota.uuid
  };
  return det;
}
